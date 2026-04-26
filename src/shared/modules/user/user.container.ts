import { ContainerModule } from 'inversify';
import { UserService } from './user-service.interface.ts';
import { Component } from '../../types/index.ts';
import { DefaultUserService } from './default-user.service.ts';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './user.entity.ts';
import { BaseController } from '../../libs/rest/index.ts';
import { UserController } from './user.controller.ts';

export function createUserContainer() {
  const userContainer = new ContainerModule(({bind}) => {
    bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
    bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
    bind<BaseController>(Component.UserController).to(UserController).inSingletonScope();
  });

  return userContainer;
}
