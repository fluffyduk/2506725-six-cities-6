import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.ts';
import { Types } from 'mongoose';
import { HttpError } from '../errors/index.ts';
import { StatusCodes } from 'http-status-codes';

export class ValidateObjectMiddleware implements Middleware {
  constructor(private param: string) { }

  execute(req: Request, _res: Response, next: NextFunction): void {
    const id = req.params[this.param];

    if (typeof id === 'string' && Types.ObjectId.isValid(id)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Ошибка в ObjectID: ${id}`,
      'ValidateObjectIdMiddleware'
    );
  }
}
