import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { LoginUserDto } from '.././dto/login-user.dto';
import { Request } from 'express';

export type LoginUserRequest = Request<
  RequestParams,
  RequestBody,
  LoginUserDto
>;
