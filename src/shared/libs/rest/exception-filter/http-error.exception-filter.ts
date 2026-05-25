import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.ts';
import { Component } from '../../../types/index.ts';
import { Logger } from '../../logger/logger.interface.ts';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/index.ts';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../../helpers/index.ts';
import { ApplicationError } from '../types/application-error.enum.ts';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(
      `[HttpErrorException]: ${req.path} # ${error.message}`,
      error
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
