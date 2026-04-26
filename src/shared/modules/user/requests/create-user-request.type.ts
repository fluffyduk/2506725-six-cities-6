import { RequestParams, RequestBody } from '../../../libs/rest';
import { CreateUserDto } from '../dto/create-user.dto';
import { Request } from 'express';

export type CreateUserRequest = Request<
  RequestParams,
  RequestBody,
  CreateUserDto
>;
