import { inject, injectable } from 'inversify';
import { DatabaseClient } from './database-client.interface.ts';
import { Component } from '../../types/component.enum.ts';
import { Logger } from '../logger/logger.interface.ts';
import { setTimeout } from 'node:timers/promises';
import mongoose from 'mongoose';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private _isConnected = false;

  constructor(@inject(Component.Logger) private readonly logger: Logger) { }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this._isConnected) {
      throw new Error('Подключение к MongoDB уже существует!');
    }

    this.logger.info('Попытка подключения к MongoDB...');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        await mongoose.connect(uri);
        this._isConnected = true;
        this.logger.info('Подключение к MongoDB успешно!');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Не удалось подключиться к базе данных. Попытка ${attempt}`, error as Error);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    this.logger.error(`Не удалось подключиться к базе данных. Количество попыток: ${RETRY_COUNT}`, new Error());
  }

  public async disconnect(): Promise<void> {
    if (!this._isConnected) {
      throw new Error('Подключение к MongoDB отсутствует!');
    }

    await mongoose.disconnect();
    this._isConnected = false;
    this.logger.info('Подключение к MongoDB остановлено!');
  }
}
