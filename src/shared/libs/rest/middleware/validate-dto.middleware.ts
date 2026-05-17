import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Middleware } from './middleware.interface.ts';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const instance = plainToInstance(this.dto, req.body);
    const errors = await validate(instance);
    if (errors) {
      const messages = errors.map((err) => Object.values(err.constraints || {})).flat();

      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Ошибка при валидации!',
        messages,
      });
      return;
    }

    next();
  }
}
