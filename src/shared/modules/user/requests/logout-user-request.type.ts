import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { Request } from 'express';

export type LogoutUserRequest = Request<
  RequestParams,
  RequestBody,
  { token: string }
>;
