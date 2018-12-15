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
  BadRequestError,
  Patch,
  Param,
  Body,
  Put,
  Delete
} from 'routing-controllers';
import { ValidationError } from 'class-validator/validation/ValidationError';
import { transformAndValidate } from '../utils';

@JsonController('/categories')
export class CategoryController {
  private categoryRepository: Repository<Category>;
  private transformAndValidateCategory: (
    obj: object | Array<{}>,
    options?: TransformValidationOptions
  ) => Promise<[any, Array<[]>]>;

  /**
   * Load the Category repository
   */
  constructor() {
    this.categoryRepository = getRepository(Category);
    this.transformAndValidateCategory = transformAndValidate(Category);
  }

  /**
   * GET /categories
   *
   * Gets all categories
   */
  @Get()
  getAll() {
    return this.categoryRepository.find();
  }

  /**
   * GET /categories/:categoryId
   *
   * Gets a category based on its Id
   * @param id
   */
  @Get('/:categoryId')
  @OnUndefined(CategoryNotFoundError)
  getOne(@Param('categoryId') id: number) {
    return this.categoryRepository.findOne(id);
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
        groups: ['creatingCategories']
      }
    });

    if (err.length) {
      throw new EntityNotValidError(err);
    } else {
      return this.categoryRepository.save(category);
    }
  }

  /**
   * PATCH /categories/:categoryId
   *
   * Updates a category based on the request's body and id paramter
   * @param id
   * @param newCategory
   */
  @Patch('/:categoryId')
  @OnUndefined(CategoryNotFoundError)
  async update(@Param('categoryId') id: number, @Body() newCategoryJSON: Category) {
    /**
     * Check if the category exists before updating it
     */
    const oldCategory: QueryResponse<Category> = await this.categoryRepository.findOne(id);
    if (oldCategory) {
      const [newCategory, err] = await this.transformAndValidateCategory(newCategoryJSON, {
        validator: {
          skipMissingProperties: true
        }
      });
      if (err.length) {
        throw new EntityNotValidError(err);
      } else {
        await this.categoryRepository.update(id, newCategory);
        return {
          status: 'Success!'
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
    const categoryToBeDeleted: QueryResponse<Category> = await this.categoryRepository.findOne(id);
    if (categoryToBeDeleted) {
      await this.categoryRepository.delete(id);
      return {
        status: 'Success!'
      };
    } else {
      return undefined;
    }
  }
}
