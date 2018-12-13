import { HttpError } from 'routing-controllers';
import { EntityError } from 'src/types/entityerror';

/**
 * STATUS: 404
 * Used for when a category hasn't been found
 */
export class CategoryNotFoundError extends HttpError {
  constructor() {
    super(404, 'Category not found!');
  }
}

/**
 * STATUS: 404
 * Used for when a product hasn't been found
 */
export class ProductNotFoundError extends HttpError {
  constructor() {
    super(404, 'Product not found!');
  }
}

/**
 * STATUS: 400
 * Used for when an entity failed to validate
 */
export class EntityNotValidError extends HttpError {
  errors: EntityError;

  constructor(errors: EntityError) {
    super(400, 'Entity not valid!');
    this.errors = errors;
    this.name = 'EntityNotValidError';
    delete this.message;
    delete this.stack;
  }
}
