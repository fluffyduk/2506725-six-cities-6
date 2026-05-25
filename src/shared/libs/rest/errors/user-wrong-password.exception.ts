import { StatusCodes } from 'http-status-codes';
import { BaseUserException } from './base-user.exception.ts';

export class UserWrongPasswordException extends BaseUserException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'Incorrect user name or password');
  }
}
