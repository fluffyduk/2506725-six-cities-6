import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.ts';
import { isObject } from '../../../helpers/common.ts';
import { PathTransformer } from '../transform/path-transformer.ts';

export class PathTransformerMiddleware implements Middleware {
  constructor(private readonly pathTransformer: PathTransformer) { }

  public async execute(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const originalJson = res.json.bind(res);
    const transformer = this.pathTransformer;
    res.json = function (data: unknown) {
      if (isObject(data)) {
        return originalJson(transformer.execute(data));
      }
      return originalJson(data);
    };

    next();
  }
}
