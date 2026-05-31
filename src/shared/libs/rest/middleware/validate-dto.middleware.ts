import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Middleware } from './middleware.interface.ts';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { ValidationError } from '../errors/validation.error.ts';
import { reduceValidationErrors } from '../../../helpers/index.ts';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const instance = plainToInstance(this.dto, req.body);
    const errors = await validate(instance);
    if (errors.length > 0) {
      throw new ValidationError(
        `Validation error: ${req.path}`,
        reduceValidationErrors(errors)
      );
    }

    next();
  }
}
