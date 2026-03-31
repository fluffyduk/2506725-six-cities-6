import { inject, injectable } from 'inversify';
import { RestSchema, Config} from '../shared/libs/config/index.ts';
import { Logger } from '../shared/libs/logger/index.ts';
import { Component } from '../shared/types/component.enum.ts';
import { getMongoURI } from '../shared/helpers/index.ts';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.ts';

@injectable()
export class RestApplication {
  constructor(
        @inject(Component.Logger) private readonly logger: Logger,
        @inject(Component.Config) private readonly config: Config<RestSchema>,
        @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
  ) { }

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

  public async init() {
    this.logger.info('REST запущен!');
    this.logger.info(`Из файла .env получено значение $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Инициализация базы данных...');
    await this._initDB();
    this.logger.info('Инициализация базы данных прошла успешно!');
  }
}
