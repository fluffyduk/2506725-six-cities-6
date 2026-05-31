import { inject, injectable } from 'inversify';
import { BaseUserException, ExceptionFilter } from '../../libs/rest/index.ts';
import { Component } from '../../types/component.enum.ts';
import { Logger } from '../../libs/logger/logger.interface.ts';
import { Request, Response, NextFunction } from 'express';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    if (res.headersSent) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json({ type: 'AUTHORIZATION', error: error.message });
  }
}
