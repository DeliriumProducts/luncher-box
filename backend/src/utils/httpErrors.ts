import { HttpError } from 'routing-controllers';

/**
 * STATUS: 404
 * Used for when a category hasn't been found
 */
export class CategoryNotFoundError extends HttpError {
  constructor() {
    super(404, 'Category not found!');
  }
}
