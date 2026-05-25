
import { RequestBody, RequestParams } from '../../../libs/rest/index.ts';
import { CreateUserDto } from '../dto/create-user.dto.ts';
import { Request } from 'express';

export type CreateUserRequest = Request<
  RequestParams,
  RequestBody,
  CreateUserDto
>;
