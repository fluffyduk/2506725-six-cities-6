import 'reflect-metadata';
import { RestApplication } from './rest/index.ts';
import { Component } from './shared/types/component.enum.ts';
import { createRestApplicationContainer } from './rest/rest.container.ts';
import { Container } from 'inversify';
import { createUserContainer } from './shared/modules/user/user.container.ts';
import { createOfferContainer } from './shared/modules/offer/offer.container.ts';
import { createCommentContainer } from './shared/modules/comments/comment.container.ts';

async function bootstrap() {
  const appContainer = new Container();

  appContainer.load(createRestApplicationContainer());
  appContainer.load(createUserContainer());
  appContainer.load(createOfferContainer());
  appContainer.load(createCommentContainer());

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
