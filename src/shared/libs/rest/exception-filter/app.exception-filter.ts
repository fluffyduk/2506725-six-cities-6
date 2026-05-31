import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.ts';
import { Component } from '../../../types/component.enum.ts';
import { Logger } from '../../logger/logger.interface.ts';
import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../../helpers/index.ts';
import { ApplicationError } from '../types/application-error.enum.ts';

@injectable()
export class AppExpectionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (res.headersSent) {
      return next(error);
    }

    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
