import { StatusCodes } from 'http-status-codes';
import { BaseUserException } from './base-user.exception.ts';

export class UserNotFoundException extends BaseUserException {
  constructor() {
    super(StatusCodes.NOT_FOUND, 'Пользователь не найден');
  }
}
