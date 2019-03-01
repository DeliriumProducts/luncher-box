import { HttpError } from 'routing-controllers';
import { ClassType, EntityError } from '../types';

/**
 * STATUS: 404
 * Used for when an entity hasn't been found
 */
export abstract class EntityNotFoundError<T> extends HttpError {
  constructor(entityName: string) {
    super(404);
    this.name = 'NotFoundError';
    this.message = `${entityName} not found!`;
    delete this.stack;
  }
}

/**
 * STATUS: 400
 * Used for when an entity failed to validate
 */
export abstract class EntityNotValidError<T> extends HttpError {
  errors: EntityError;

  constructor(entityName: string, errors: EntityError) {
    super(400);
    this.errors = errors;
    this.name = 'NotValidError';
    this.message = `${entityName} not valid!`;
    delete this.stack;
  }
}

/**
 * STATUS: 422
 * Used for when a duplicate entity was found
 */
export abstract class DuplicateEntityError<T> extends HttpError {
  errors: EntityError;

  constructor(entityName: string) {
    super(422);
    this.name = 'DuplicateError';
    this.message = `Duplicate ${entityName} entry!`;
    delete this.stack;
  }
}
