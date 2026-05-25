import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.ts';
import { HttpError } from '../errors/index.ts';
import { StatusCodes } from 'http-status-codes';

export class PrivateRouteMiddleware implements Middleware {
  execute({ tokenPayload }: Request, _res: Response, next: NextFunction): void {
    if (!tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Неавторизован',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
