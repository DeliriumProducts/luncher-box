import { CategoryNotFoundError } from './../utils/httpErrors';
import { TransformValidationOptions } from 'class-transformer-validator';
import { QueryResponse } from '../types';
import { Category } from '../entities';
import { ProductNotFoundError, EntityNotValidError } from '../utils';
import { TransformAndValidateTuple } from '../types';
import { Product } from '../entities';
import {
  JsonController,
  Get,
  OnUndefined,
  Param,
  Post,
  Body,
  Patch,
  Delete
} from 'routing-controllers';
import { Repository, getRepository } from 'typeorm';
import { transformAndValidate } from '../utils';

@JsonController('/products')
export class ProductController {
  private productRepository: Repository<Product>;
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
    this.transformAndValidateCategory = transformAndValidate(Category);
    this.transformAndValidateProduct = transformAndValidate(Product);
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
    return await this.productRepository.findOne(id);
  }

  /**
   * POST /products
   *
   * Creates a product based on the request's body
   * @param productJSON
   */
  @Post()
  async create(@Body() productJSON: Product) {
    /**
     * Validate the product and then the nested array of categories (productJSON.categories)
     */
    const [product, productErrors] = await this.transformAndValidateProduct(productJSON);
    const [category, categoriesErrors] = await this.transformAndValidateCategory(
      productJSON.categories
    );
    if (productErrors.length || categoriesErrors.length) {
      throw new EntityNotValidError(productErrors.concat(categoriesErrors));
    } else {
      /**
       * Throw an error if a category doesn't exist when creating a product
       */
      try {
        await this.productRepository.save(product);
        return {
          status: 'New product created!'
        };
      } catch (error) {
        throw new CategoryNotFoundError();
      }
    }
  }

  /**
   * PATCH /products/:productId
   *
   * Updates a product based on the request's body and id paramter
   * @param id
   * @param newProductJSON
   */
  @Patch('/:productId')
  @OnUndefined(ProductNotFoundError)
  async update(@Param('productId') id: number, @Body() newProductJSON: Product) {
    /**
     * Check if the product exists before updating it
     */
    const oldProduct: QueryResponse<Product> = await this.productRepository.findOne(id);
    if (oldProduct) {
      const [newProduct, err] = await this.transformAndValidateProduct(newProductJSON);
      if (err.length) {
        throw new EntityNotValidError(err);
      } else {
        await this.productRepository.update(id, newProduct);
        return {
          status: 'Product edited!'
        };
      }
    } else {
      return undefined;
    }
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
        status: 'Product deleted!'
      };
    } else {
      return undefined;
    }
  }
}
