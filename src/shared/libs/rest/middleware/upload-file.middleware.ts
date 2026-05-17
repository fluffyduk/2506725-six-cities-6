import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { randomUUID } from 'node:crypto';

export class UploadFileMiddleware implements Middleware {
  constructor(
        private uploadDirectory: string,
        private fieldName: string
  ) { }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtention = extension(file.mimetype);
        const filename = randomUUID();
        callback(null, `${filename}.${fileExtention}`);
      },
    });

    const uploadFileMiddleware = multer({ storage }).single(
      this.fieldName
    );

    uploadFileMiddleware(req, res, next);
  }
}
