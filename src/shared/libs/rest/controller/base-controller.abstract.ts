import { injectable } from 'inversify';
import { Controller } from './controller.interface';
import { Logger } from '../../logger';
import {
    NextFunction,
    RequestHandler,
    Request,
    Response,
    Router,
} from 'express';
import { Route } from '../types/route.interface';
import { StatusCodes } from 'http-status-codes';

const DEFAULT_CONTENT_TYPE = 'application/json';

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
        this._router[route.method](route.path, wrapperAsyncHandler);
        this.logger.info(
            `Route registered: ${route.method.toUpperCase()} ${route.path}`
        );
    }

    public send<T>(res: Response, statusCode: number, data: T): void {
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