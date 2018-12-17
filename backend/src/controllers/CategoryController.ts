import { TransformAndValidateTuple } from '../types';
import { Product } from './../entities/Product';
import { TransformValidationOptions } from 'class-transformer-validator';
import { QueryResponse } from '../types';
import { CategoryNotFoundError, EntityNotValidError } from '../utils';
import { Repository, getRepository } from 'typeorm';
import { Category } from '../entities';
import {
  Get,
  JsonController,
  Post,
  OnUndefined,
  Param,
  Body,
  Delete,
  Put
} from 'routing-controllers';
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
    this.productRepository = getRepository(Product);
    this.transformAndValidateCategory = transformAndValidate(Category);
  }

  /**
   * GET /categories
   *
   * Gets all categories
   */
  @Get()
  async getAll() {
    return await this.categoryRepository.find();
  }

  /**
   * GET /categories/:categoryId
   *
   * Gets a category and its products based on the Id
   * @param id
   */
  @Get('/:categoryId')
  @OnUndefined(CategoryNotFoundError)
  async getOne(@Param('categoryId') id: number) {
    return await this.categoryRepository.findOne(id, {
      relations: ['products']
    });
  }

  /**
   * POST /categories
   *
   * Creates a category based on the request's body
   * @param category
   */
  @Post()
  async create(@Body() categoryJSON: Category) {
    const [category, err] = await this.transformAndValidateCategory(categoryJSON, {
      validator: {
        groups: ['creatingCategory']
      }
    });
    if (err.length) {
      throw new EntityNotValidError(err);
    } else {
      await this.categoryRepository.save(category);
      return {
        status: 'New category created!'
      };
    }
  }

  /**
   *  PUT /categories/:categoryId
   *
   * Updates a category based on the request's body and id paramter
   * @param id
   * @param newCategory
   */
  @Put('/:categoryId')
  @OnUndefined(CategoryNotFoundError)
  async update(@Param('categoryId') id: number, @Body() newCategoryJSON: Category) {
    /**
     * Check if the category exists before updating it
     */
    const oldCategory: QueryResponse<Category> = await this.categoryRepository.findOne(id);
    if (oldCategory) {
      const [newCategory, err] = await this.transformAndValidateCategory(newCategoryJSON, {
        validator: {
          groups: ['creatingCategory']
        }
      });
      if (err.length) {
        throw new EntityNotValidError(err);
      } else {
        await this.categoryRepository.update(id, newCategory);
        return {
          status: 'Category updated!'
        };
      }
    } else {
      return undefined;
    }
  }

  /**
   * DELETE /categories/:categoryId
   *
   * Deletes a category based on the request's body and id paramter
   * @param id
   */
  @Delete('/:categoryId')
  @OnUndefined(CategoryNotFoundError)
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
      return {
        status: 'Category deleted!'
      };
    } else {
      return undefined;
    }
  }
}
