import { HttpError } from 'routing-controllers';
import { EntityError } from 'src/types/entityerror';
import { ClassType } from '../types';
import { Product } from '../entities';

/**
 * STATUS: 404
 * Used for when an entity hasn't been found
 */
export class EntityNotFoundError<T> extends HttpError {
  constructor(cls: ClassType<T>) {
    super(404, `${cls.name} not found!`);
  }
}

/**
 * STATUS: 400
 * Used for when an entity failed to validate
 */
export class EntityNotValidError<T> extends HttpError {
  errors: EntityError;

  constructor(cls: ClassType<T>, errors: EntityError) {
    super(400);
    this.errors = errors;
    this.name = `${cls.name} not valid!`;
    delete this.message;
    delete this.stack;
  }
}

/**
 * STATUS: 422
 * Used for when a duplicate entity was found
 */
export class DuplicateEntityError<T> extends HttpError {
  errors: EntityError;

  constructor(cls: ClassType<T>) {
    super(422);
    this.name = `Duplicate ${cls.name} entry!`;
    delete this.message;
    delete this.stack;
  }
}
