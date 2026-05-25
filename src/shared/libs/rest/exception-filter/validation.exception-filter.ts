import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.ts';
import { Component } from '../../../types/index.ts';
import { Logger } from '../../logger/logger.interface.ts';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../errors/validation.error.ts';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../../helpers/index.ts';
import { ApplicationError } from '../types/application-error.enum.ts';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`, error);

    error.details.forEach((errorField) =>
      this.logger.warn(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createErrorObject(
          ApplicationError.ValidationError,
          error.message,
          error.details
        )
      );
  }
}
