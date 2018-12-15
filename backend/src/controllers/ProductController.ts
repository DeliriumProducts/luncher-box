import { QueryResponse } from '../types';
import { Category } from '../entities';
import { ProductNotFoundError, EntityNotValidError } from '../utils';
import { Product } from '../entities';
import {
  JsonController,
  Get,
  OnUndefined,
  Param,
  Post,
  Body,
  BadRequestError,
  Patch,
  Delete,
  BodyParam
} from 'routing-controllers';
import { Repository, getRepository } from 'typeorm';
import { transformAndValidate } from '../utils';

@JsonController('/products')
export class ProductController {
  private productRepository: Repository<Product>;

  /**
   * Load the Product repository
   */
  constructor() {
    this.productRepository = getRepository(Product);
  }

  /**
   * GET /products
   *
   * Gets all products
   */
  @Get()
  getAll() {
    return this.productRepository.find();
  }

  /**
   * GET /products/:productId
   *
   * Gets a product based on its Id
   * @param productId
   */
  @Get('/:productId')
  @OnUndefined(ProductNotFoundError)
  getOne(@Param('productId') id: number) {
    return this.productRepository.findOne(id);
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
    const [product, productErrors] = await transformAndValidate(Product, productJSON);

    const [category, categoriesErrors] = await transformAndValidate(
      Category,
      productJSON.categories,
      {
        validator: {
          /**
           * Special validator group which enforces the requirement of the Id (check the entity for info)
           * Strips out every other property but the Id
           */
          groups: ['creatingProducts']
        }
      }
    );

    /**
     * Replace the cateogries after everything but the Id has been removed
     */
    product.categories = category;

    if (productErrors.length || categoriesErrors.length) {
      throw new EntityNotValidError(productErrors.concat(categoriesErrors));
    } else {
      return this.productRepository.save(product);
    }
  }

  /**
   * PATCH /products/:productId
   *
   * Updates a product based on the request's body and id paramter
   * @param id
   * @param newProduct
   */
  @Patch('/:productId')
  @OnUndefined(ProductNotFoundError)
  async update(@Param('productId') id: number, @Body() newProductJSON: Product) {
    /**
     * Check if the product exists before updating it
     */
    const oldProduct: QueryResponse<Product> = await this.productRepository.findOne(id);
    if (oldProduct) {
      const [newProduct, err] = await transformAndValidate(Product, newProductJSON, {
        validator: {
          skipMissingProperties: true
        }
      });

      if (err.length) {
        throw new EntityNotValidError(err);
      } else {
        await this.productRepository.update(id, newProduct);
        return {
          status: 'Success!'
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
        status: 'Success!'
      };
    } else {
      return undefined;
    }
  }
}
