import { inject, injectable } from 'inversify';
import { Component } from '../../../types/index.ts';
import { Logger } from '../../logger/logger.interface.ts';
import { Config } from '../../config/config.interface.ts';
import { RestSchema } from '../../config/rest.schema.ts';
import { DEFAULT_STATIC_IMAGES, STATIC_RESOURCE_FIELDS } from './path-transformer.constant.ts';
import { getFullServerPath, isObject } from '../../../helpers/index.ts';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from '../../../../rest/index.ts';

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    this.logger.info('PathTranformer created!');
  }

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  private getStaticResourcePath(value: string): string {
    if (value.startsWith('http')) {
      return value;
    }

    const staticPath = STATIC_FILES_ROUTE;
    const uploadPath = STATIC_UPLOAD_ROUTE;
    const serverHost = this.config.get('HOST');
    const serverPort = this.config.get('PORT');
    const rootPath = this.hasDefaultImage(value)
      ? staticPath
      : uploadPath;

    return `${getFullServerPath(serverHost, serverPort)}${rootPath}/${value}`;
  }

  public execute<T>(data: T): T {
    const stack: unknown[] = [data];
    while (stack.length > 0) {
      const current = stack.pop();

      if (Array.isArray(current)) {
        current.forEach((item) => {
          if (isObject(item) || Array.isArray(item)) {
            stack.push(item);
          }
        });
        continue;
      }

      if (!isObject(current)) {
        continue;
      }

      const currentObject = current as Record<string, unknown>;

      for (const key in currentObject) {
        if (Object.hasOwn(currentObject, key)) {
          const value = currentObject[key];

          if (isObject(value) || Array.isArray(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === 'string') {
            currentObject[key] = this.getStaticResourcePath(value);
          }

          if (this.isStaticProperty(key) && Array.isArray(value)) {
            currentObject[key] = value.map((item) =>
              typeof item === 'string' ? this.getStaticResourcePath(item) : item
            );
          }
        }
      }
    }

    return data;
  }
}
