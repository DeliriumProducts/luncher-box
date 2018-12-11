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

type ProductReponse = Product | undefined;

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
    const [product, err1] = await transformAndValidate(Product, productJSON);
    const [category, err2] = await transformAndValidate(
      Category,
      productJSON.categories
    );

    console.log(product);
    console.log(category);

    if (err1 || err2) {
      throw new BadRequestError(`${err1}\n${err2}`);
    } else {
      await this.productRepository.save(product);
      return {
        status: 'Success!'
      };
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
    const oldProduct: ProductReponse = await this.productRepository.findOne(id);
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
        await this.productRepository.update(id, newProduct);
        return {
          status: 'Success!'
        };
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
    const productToBeDeleted: ProductReponse = await this.productRepository.findOne(
      id
    );
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
