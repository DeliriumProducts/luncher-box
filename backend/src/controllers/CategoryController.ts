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
import { Category, CategoryNotFoundError, CategoryNotValidError, Product } from '../entities';
import { QueryResponse, TransformAndValidateTuple } from '../types';
import { transformAndValidate } from '../utils';

@JsonController('/categories')
export class CategoryController {
  private categoryRepository: Repository<Category>;
  private productRepository: Repository<Product>;
  private transformAndValidateCategory: (
    obj: object | Array<{}>,
    options?: TransformValidationOptions
  ) => TransformAndValidateTuple<Category>;

  /**
   * Load the Category repository
   */
  constructor() {
    this.categoryRepository = getRepository(Category);
    this.transformAndValidateCategory = transformAndValidate(Category);
    this.productRepository = getRepository(Product);
  }

  /**
   * GET /categories
   *
   * Gets all categories
   */
  @Get()
  async getAll(
    @QueryParam('page') page?: number,
    @QueryParam('limit') limit: number = 0,
    @QueryParam('since') since?: number
  ) {
    if (since) {
      const categories = await this.categoryRepository.find({
        where: { id: MoreThan(since) },
        take: limit
      });

      return categories;
    }

    if (page) {
      const categories = await this.categoryRepository.find({
        skip: limit * (page - 1),
        take: limit
      });

      return categories;
    } else {
      const categories = await this.categoryRepository.find();

      return categories;
    }
  }

  /**
   * GET /categories/:categoryId
   *
   * Gets a category and its products based on the Id
   * @param id
   */
  @Get('/:categoryId')
  async getOne(@Param('categoryId') id: number) {
    const category = await this.categoryRepository.findOne(id, {
      relations: ['products']
    });

    if (category) {
      return category;
    }

    throw new CategoryNotFoundError();
  }

  /**
   * POST /categories
   *
   * Creates a category based on the request's body
   * @param category
   */
  @Post()
  @Authorized()
  async create(@Body() categoryJSON: Category) {
    const [category, err] = await this.transformAndValidateCategory(categoryJSON);

    if (err.length) {
      throw new CategoryNotValidError(err);
    }

    return await this.categoryRepository.save(category);
  }

  /**
   *  PUT /categories/:categoryId
   *
   * Updates a category based on the request's body and id paramter
   * @param id
   * @param newCategory
   */
  @Put('/:categoryId')
  @Authorized()
  async update(@Param('categoryId') id: number, @Body() newCategoryJSON: Category) {
    /**
     * Check if the category exists before updating it
     */
    const oldCategory: QueryResponse<Category> = await this.categoryRepository.findOne(id);

    if (oldCategory) {
      const [newCategory, err] = await this.transformAndValidateCategory(newCategoryJSON);

      if (err.length) {
        throw new CategoryNotValidError(err);
      }

      newCategory.id = oldCategory.id;

      return await this.categoryRepository.save(newCategory);
    }

    throw new CategoryNotFoundError();
  }

  /**
   * DELETE /categories/:categoryId
   *
   * Deletes a category based on the request's body and id paramter
   * @param id
   */
  @Delete('/:categoryId')
  @Authorized()
  async delete(@Param('categoryId') id: number) {
    /**
     * Check if the category exists before deleting it
     */
    const categoryToBeDeleted: QueryResponse<Category> = await this.categoryRepository.findOne(id, {
      relations: ['products', 'products.categories']
    });

    if (categoryToBeDeleted) {
      /**
       * Remove products from the category before deleting it
       */
      for (const product of categoryToBeDeleted.products) {
        /**
         * Remove the product if it doesn't belong to any other categories
         */
        if (product.categories.length < 2) {
          await this.productRepository.remove(product);
        }
      }
      await this.categoryRepository.delete(id);
      return 'Category deleted!';
    }

    throw new CategoryNotFoundError();
  }
}
