import { inject, injectable } from 'inversify';
import { RestSchema, Config } from '../shared/libs/config/index.ts';
import { Logger } from '../shared/libs/logger/index.ts';
import { Component } from '../shared/types/component.enum.ts';
import { getFullServerPath, getMongoURI } from '../shared/helpers/index.ts';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.ts';
import express, { Express } from 'express';
import { Controller, ExceptionFilter, ParseTokenMiddleware } from '../shared/libs/rest/index.ts';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from './rest.constant.ts';
import cors from 'cors';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
        @inject(Component.Logger) private readonly logger: Logger,
        @inject(Component.Config) private readonly config: Config<RestSchema>,
        @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
        @inject(Component.OfferController) private readonly offerController: Controller,
        @inject(Component.UserController) private readonly userController: Controller,
        @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
        @inject(Component.CommentController) private readonly commentController: Controller,
        @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
        @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
        @inject(Component.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilter

  ) {
    this.server = express();
  }

  private async _initDB() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/offers', this.commentController.router);
    this.server.use('/users', this.userController.router);
  }

  private async _initMiddleware() {
    const authMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(express.json());
    this.server.use(STATIC_UPLOAD_ROUTE, express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.server.use(STATIC_FILES_ROUTE, express.static(this.config.get('STATIC_DIRECTORY_PATH')));
    this.server.use(authMiddleware.execute.bind(authMiddleware));
    this.server.use(cors());
  }

  private async _initExceptionFilter() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
  }

  public async init() {
    this.logger.info('REST запущен!');
    this.logger.info(`Из файла .env получено значение $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Инициализация базы данных...');
    await this._initDB();
    this.logger.info('Инициализация базы данных прошла успешно!');

    this.logger.info('Инициализация сервера...');
    await this._initServer();
    this.logger.info(`Сервер запущен на ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);

    this.logger.info('Инициализация промежуточного ПО...');
    await this._initMiddleware();
    this.logger.info('Промежуточное ПО успешно инициализировано!');

    this.logger.info('Инициализация контроллеров...');
    await this._initControllers();
    this.logger.info('Контроллеры успешно инициализированы!');

    this.logger.info('Инициализация фильтра...');
    await this._initExceptionFilter();
    this.logger.info('Фильтр успешно инициализирован!');
  }
}
