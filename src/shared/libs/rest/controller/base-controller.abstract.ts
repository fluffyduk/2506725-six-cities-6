import { injectable } from 'inversify';
import { Controller } from './controller.interface.ts';
import { Logger } from '../../logger/index.ts';
import {
  NextFunction,
  RequestHandler,
  Request,
  Response,
  Router,
} from 'express';
import { Route } from '../types/route.interface.ts';
import { StatusCodes } from 'http-status-codes';

const DEFAULT_CONTENT_TYPE = 'application/json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;
  constructor(protected readonly logger: Logger) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  addRoute(route: Route): void {
    const handler = route.handler.bind(this);
    const wrapperAsyncHandler = this.asyncHandler(handler);

    const middlewareHandlers = route.middlewares?.map((item) => this.asyncHandler(item.execute.bind(item)));

    const allHandlers = middlewareHandlers
      ? [...middlewareHandlers, wrapperAsyncHandler]
      : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(
      `Route registered: ${route.method.toUpperCase()} ${route.path}`
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    if (!isRecord(data)) {
      throw new Error('Некорректные данные формы');
    }

    res.type(DEFAULT_CONTENT_TYPE).status(statusCode).json(data);
  }

  ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  private asyncHandler(fn: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = fn(req, res, next);

      if (result instanceof Promise) {
        result.catch(next);
      }

      return result;
    };
  }
}
