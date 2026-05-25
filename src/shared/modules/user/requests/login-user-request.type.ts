import { RequestBody, RequestParams } from '../../../libs/rest/index.ts';
import { LoginUserDto } from '.././dto/login-user.dto.ts';
import { Request } from 'express';

export type LoginUserRequest = Request<
  RequestParams,
  RequestBody,
  LoginUserDto
>;
