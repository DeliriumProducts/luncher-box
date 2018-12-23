import { TransformValidationOptions } from 'class-transformer-validator';
import { QueryResponse } from '../types';
import {
  Category,
  Product,
  ProductNotFoundError,
  ProductNotValidError,
  DuplicateProductError,
  CategoryNotFoundError
} from '../entities';
import { TransformAndValidateTuple } from '../types';
import {
  JsonController,
  Get,
  OnUndefined,
  Param,
  Post,
  Body,
  Delete,
  Put
} from 'routing-controllers';
import { Repository, getRepository } from 'typeorm';
import { transformAndValidate } from '../utils';

@JsonController('/products')
export class ProductController {
  private productRepository: Repository<Product>;
  private categoryRepository: Repository<Category>;
  private transformAndValidateProduct: (
    obj: object | Array<{}>,
    options?: TransformValidationOptions
  ) => TransformAndValidateTuple<Product>;
  private transformAndValidateCategory: (
    obj: object | Array<{}>,
    options?: TransformValidationOptions
  ) => TransformAndValidateTuple<Category>;

  /**
   * Load the Product repository
   */
  constructor() {
    this.productRepository = getRepository(Product);
    this.categoryRepository = getRepository(Category);
    this.transformAndValidateProduct = transformAndValidate(Product);
    this.transformAndValidateCategory = transformAndValidate(Category);
  }

  /**
   * GET /products
   *
   * Gets all products
   */
  @Get()
  async getAll() {
    return await this.productRepository.find();
  }

  /**
   * GET /products/:productId
   *
   * Gets a product based on its Id
   * @param productId
   */
  @Get('/:productId')
  @OnUndefined(ProductNotFoundError)
  async getOne(@Param('productId') id: number) {
    return await this.productRepository.findOne(id, {
      relations: ['categories']
    });
  }

  /**
   * POST /products
   *
   * Creates a product based on the request's body
   * @param productJSON
   */
  @Post()
  @OnUndefined(CategoryNotFoundError)
  async create(@Body() productJSON: Product) {
    const [product, productErr] = await this.transformAndValidateProduct(productJSON);

    if (productErr.length) {
      throw new ProductNotValidError(productErr);
    }

    /**
     * Throw an error if a category doesn't exist when creating a product
     */
    const categories = await this.categoryRepository.find();
    const validCategories: Category[] = [];

    for (const category of product.categories) {
      /**
       * Make sure only an array of objects are being passed
       */
      if (typeof category === 'object') {
        for (const entities of categories) {
          /**
           * Add only the valid categories
           */
          if (category.id === entities.id) {
            validCategories.push(category);
          }
        }
      }
    }

    if (!validCategories.length) {
      return undefined;
    } else {
      product.categories = validCategories;
    }

    await this.productRepository.save(product);
    return {
      message: 'New product created!'
    };
  }

  /**
   *  PUT /products/:productId
   *
   * Updates a product based on the request's body and id paramter
   * @param id
   * @param newProductJSON
   */
  @Put('/:productId')
  @OnUndefined(ProductNotFoundError)
  async update(@Param('productId') id: number, @Body() newProductJSON: Product) {
    /**
     * Check if the product exists before updating it
     */
    const oldProduct: QueryResponse<Product> = await this.productRepository.findOne(id);

    if (oldProduct) {
      const [newProduct, productErr] = await this.transformAndValidateProduct(newProductJSON);

      if (productErr.length) {
        throw new ProductNotValidError(productErr);
      }

      /**
       * Throw an error if a category doesn't exist when creating a product
       */
      const categories = await this.categoryRepository.find();
      const validCategories: Category[] = [];

      for (const category of newProduct.categories) {
        /**
         * Make sure only an array of objects are being passed
         */
        if (typeof category === 'object') {
          for (const entities of categories) {
            /**
             * Add only the valid categories
             */
            if (category.id === entities.id) {
              validCategories.push(category);
            }
          }
        }
      }

      if (!validCategories.length) {
        return undefined;
      } else {
        newProduct.categories = validCategories;
      }

      newProduct.id = oldProduct.id;

      await this.productRepository.save(newProduct);
      return {
        message: 'Product edited!'
      };
    }

    return undefined;
  }

  /**
   * DELETE /products/:productId
   *
   * Delets a product based on the request's body and id paramter
   * @param id
   */
  @Delete('/:productId')
  @OnUndefined(ProductNotFoundError)
  async delete(@Param('productId') id: number) {
    /**
     * Check if the product exists before deleting it
     */
    const productToBeDeleted: QueryResponse<Product> = await this.productRepository.findOne(id);

    if (productToBeDeleted) {
      await this.productRepository.delete(id);
      return {
        message: 'Product deleted!'
      };
    }

    return undefined;
  }
}
