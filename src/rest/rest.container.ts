import { ContainerModule } from 'inversify';
import { RestApplication } from './rest.application.ts';
import { Component } from '../shared/types/index.ts';
import { Logger, PinoLogger } from '../shared/libs/logger/index.ts';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.ts';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.ts';

export function createRestApplicationContainer() {
  const restApplicationContainer = new ContainerModule(({bind}) => {
    bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
    bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
    bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
    bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  });

  return restApplicationContainer;
}
