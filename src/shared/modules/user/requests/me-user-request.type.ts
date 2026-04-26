import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { Request } from 'express';
import { CreateUserDto } from '../dto/create-user.dto.js';

export type MeUserRequest = Request<
  RequestParams,
  RequestBody,
  CreateUserDto & { id: string }
>;
