import { HttpError } from './http-error.ts';

export class BaseUserException extends HttpError {
  constructor(httpStatusCode: number, message: string) {
    super(httpStatusCode, message);
  }
}
