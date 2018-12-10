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

/**
 * STATUS: 404
 * Used for when a product hasn't been found
 */
export class ProductNotFoundError extends HttpError {
  constructor() {
    super(404, 'Product not found!');
  }
}
