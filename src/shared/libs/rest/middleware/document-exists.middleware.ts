import { Request, Response, NextFunction } from 'express';
import { DocumentExists } from '../../../types/document-exists.interface.ts';
import { Middleware } from './middleware.interface.ts';
import { HttpError } from '../errors/http-error.ts';
import { StatusCodes } from 'http-status-codes';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
        private readonly service: DocumentExists,
        private readonly entityName: string,
        private readonly paramName: string
  ) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = req.params[this.paramName];
    if (typeof documentId === 'string' && !(await this.service.documentExists(documentId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Документ с именем ${this.entityName} и id ${documentId} не найден`,
        'DocumentExistsMiddleware'
      );
    }
    next();
  }
}
