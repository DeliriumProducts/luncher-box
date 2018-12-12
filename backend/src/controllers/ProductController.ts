import { QueryResponse } from './../types/queryresponse.d';
import { Category } from './../entities/Category';
import { ProductNotFoundError } from './../utils/httpErrors';
import { Product } from './../entities/Product';
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
import { ValidationError, validate } from 'class-validator';
import formatValidationMessage from '../utils/formatValidationMessage';
import transformAndValidate from '../utils/transformAndValidate';

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
   * @param id
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
     * Validate the product and then the nested array of categories (product.categories)
     * The requireId group is necessary in order to validate that the categoryId has been sent
     */
    const [product, firstErr] = await transformAndValidate(
      Product,
      productJSON,
      {
        validator: { whitelist: true }
      }
    );

    const [category, secondErr] = await transformAndValidate(
      Category,
      productJSON.categories,
      {
        validator: {
          whitelist: true,
          groups: ['requireId']
        }
      }
    );

    console.log(category);
    console.log(product);

    if (firstErr || secondErr) {
      throw new BadRequestError(`${firstErr}\n${secondErr}`);
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
  async update(@Param('productId') id: number, @Body() newProduct: Product) {
    const oldProduct: QueryResponse<
      Product
    > = await this.productRepository.findOne(id);
    if (oldProduct) {
      const errors: ValidationError[] = await validate(newProduct, {
        skipMissingProperties: true,
        whitelist: true
      });

      if (errors.length) {
        throw new BadRequestError(
          JSON.stringify(formatValidationMessage(errors))
        );
      } else {
        return await this.productRepository.update(id, newProduct);
      }
    } else {
      throw new ProductNotFoundError();
    }
  }

  /**
   * DELETE /products/:productId
   *
   * Delets a product based on the request's body and id paramter
   * @param id
   */
  @Delete('/:productId')
  async delete(@Param('productId') id: number) {
    const productToBeDeleted: QueryResponse<
      Product
    > = await this.productRepository.findOne(id);
    if (productToBeDeleted) {
      await this.productRepository.delete(id);
      return {
        status: 'Success!'
      };
    } else {
      throw new ProductNotFoundError();
    }
  }
}
