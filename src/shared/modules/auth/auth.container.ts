import { ContainerModule } from 'inversify';
import { AuthService } from './auth-service.interface.ts';
import { ExceptionFilter } from '../../libs/rest/index.ts';
import { Component } from '../../types/index.ts';
import { AuthExceptionFilter } from './auth.exception-filter.ts';
import { DefaultAuthService } from './default-auth.service.ts';

export function createAuthContainer(): ContainerModule {
  const authContainer = new ContainerModule(({ bind }) => {
    bind<AuthService>(Component.AuthService)
      .to(DefaultAuthService)
      .inSingletonScope();

    bind<ExceptionFilter>(Component.AuthExceptionFilter)
      .to(AuthExceptionFilter)
      .inSingletonScope();
  });

  return authContainer;
}
