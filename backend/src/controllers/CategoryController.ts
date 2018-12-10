import { CategoryNotFoundError } from './../utils/httpErrors';
import formatValidationMessage from '../utils/formatValidationMessage';
import { Repository, getRepository } from 'typeorm';
import { Category } from '../entities/Category';
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
import { validate } from 'class-validator';

type CategoryResponse = Category | undefined;

@JsonController('/categories')
export class CategoryController {
  private categoryRepository: Repository<Category>;

  /**
   * Load the Category repository
   */
  constructor() {
    this.categoryRepository = getRepository(Category);
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
  async create(@Body() category: Category) {
    const errors: ValidationError[] = await validate(category, {
      whitelist: true
    });
    if (errors.length) {
      throw new BadRequestError(
        JSON.stringify(formatValidationMessage(errors))
      );
    } else {
      await this.categoryRepository.save(category);
      return {
        status: 'Success!'
      };
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
  async update(@Param('categoryId') id: number, @Body() newCategory: Category) {
    const oldCategory: CategoryResponse = await this.categoryRepository.findOne(
      id
    );
    if (oldCategory) {
      const errors: ValidationError[] = await validate(newCategory, {
        skipMissingProperties: true,
        whitelist: true
      });
      if (errors.length) {
        throw new BadRequestError(
          JSON.stringify(formatValidationMessage(errors))
        );
      } else {
        await this.categoryRepository.update(id, newCategory);
        return {
          status: 'Success!'
        };
      }
    } else {
      throw new CategoryNotFoundError();
    }
  }

  /**
   * DELETE /categories/:categoryId
   *
   * Deletes a category based on the request's body and id paramter
   * @param id
   * @param newCategory
   */
  @Delete('/:categoryId')
  async delete(@Param('categoryId') id: number) {
    const categoryToBeDeleted: CategoryResponse = await this.categoryRepository.findOne(
      id
    );
    if (categoryToBeDeleted) {
      await this.categoryRepository.delete(id);
      return {
        status: 'Success!'
      };
    } else {
      throw new CategoryNotFoundError();
    }
  }
}
