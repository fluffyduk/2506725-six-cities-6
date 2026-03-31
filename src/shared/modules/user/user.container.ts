import { ContainerModule } from 'inversify';
import { UserService } from './user-service.interface.ts';
import { Component } from '../../types/index.ts';
import { DefaultUserService } from './default-user.service.ts';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './user.entity.ts';

export function createUserContainer() {
  const userContainer = new ContainerModule(({bind}) => {
    bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
    bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  });

  return userContainer;
}
