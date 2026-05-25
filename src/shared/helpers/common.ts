import { ClassConstructor, plainToInstance } from 'class-transformer';
import { HttpError, RequestParams } from '../libs/rest/index.ts';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../libs/rest/types/validation-error-field.type.ts';
import { ApplicationError } from '../libs/rest/types/application-error.enum.ts';

export function generateRandomInteger(min: number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomInteger(0, items.length - 1);
  const endPosition = startPosition + generateRandomInteger(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomInteger(0, items.length - 1)];
}

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const includes = <T>(array: readonly T[], value: unknown): boolean =>
  (array as readonly unknown[]).includes(value);

export const fillDTO = <T, V>(someDTO: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDTO, plainObject, { excludeExtraneousValues: true });

export function createErrorObject(
  errorType: ApplicationError,
  error: string,
  details: ValidationErrorField[] = []
) {
  return { errorType, error, details };
}

export const getId = (params: RequestParams): string => {
  const { offerId } = params;
  if (typeof offerId !== 'string') {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Некорректный ID: ${offerId}`
    );
  }

  return offerId;
};

export function reduceValidationErrors(
  errors: ValidationError[]
): ValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}

export const isObject = (value: unknown): value is Record<string, object> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
