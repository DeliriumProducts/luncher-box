import { TransformValidationOptions } from 'class-transformer-validator';
import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam
} from 'routing-controllers';
import { getRepository, MoreThan, Repository } from 'typeorm';
import {
  Category,
  CategoryNotFoundError,
  Product,
  ProductNotFoundError,
  ProductNotValidError
} from '../entities';
import { QueryResponse, TransformAndValidateTuple } from '../types';
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
  async getAll(
    @QueryParam('page') page?: number,
    @QueryParam('limit') limit: number = 0,
    @QueryParam('since') since?: number
  ) {
    if (since) {
      const products = await this.productRepository.find({
        where: { id: MoreThan(since) },
        take: limit,
      });

      return products;
    }

    if (page) {
      const products = await this.productRepository.find({
        skip: limit * (page - 1),
        take: limit,
      });

      return products;
    } else {
      const products = await this.productRepository.find();

      return products;
    }
  }

  /**
   * GET /products/:productId
   *
   * Gets a product based on its Id
   * @param productId
   */
  @Get('/:productId')
  async getOne(@Param('productId') id: number) {
    const product = await this.productRepository.findOne(id, {
      relations: ['categories']
    });

    if (product) {
      return product;
    }

    throw new ProductNotFoundError();
  }

  /**
   * POST /products
   *
   * Creates a product based on the request's body
   * @param productJSON
   */
  @Post()
  @Authorized()
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
      throw new CategoryNotFoundError();
    }

    product.categories = validCategories;

    return await this.productRepository.save(product);
  }

  /**
   *  PUT /products/:productId
   *
   * Updates a product based on the request's body and id paramter
   * @param id
   * @param newProductJSON
   */
  @Put('/:productId')
  @Authorized()
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
        throw new CategoryNotFoundError();
      }

      newProduct.categories = validCategories;
      newProduct.id = oldProduct.id;

      return await this.productRepository.save(newProduct);
    }

    throw new ProductNotFoundError();
  }

  /**
   * DELETE /products/:productId
   *
   * Delets a product based on the request's body and id paramter
   * @param id
   */
  @Delete('/:productId')
  @Authorized()
  async delete(@Param('productId') id: number) {
    /**
     * Check if the product exists before deleting it
     */
    const productToBeDeleted: QueryResponse<Product> = await this.productRepository.findOne(id);

    if (productToBeDeleted) {
      await this.productRepository.delete(id);
      return 'Product deleted!';
    }

    throw new ProductNotFoundError();
  }
}
