import { inject, injectable } from 'inversify';
import { RestSchema, Config } from '../shared/libs/config/index.ts';
import { Logger } from '../shared/libs/logger/index.ts';
import { Component } from '../shared/types/component.enum.ts';
import { getMongoURI } from '../shared/helpers/index.ts';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.ts';
import express, { Express } from 'express';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.ts';

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
    this.server.use('/users', this.userController.router);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
  }

  private async _initExceptionFilter() {
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('REST запущен!');
    this.logger.info(`Из файла .env получено значение $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Инициализация базы данных...');
    await this._initDB();
    this.logger.info('Инициализация базы данных прошла успешно!');

    this.logger.info('Инициализация сервера...');
    await this._initServer();
    this.logger.info(`Сервер запущен на http://localhost:${this.config.get('PORT')}`);

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
