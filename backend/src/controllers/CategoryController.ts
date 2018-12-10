import formatValidationMessage from '../utils/formatValidationMessage';
import { Repository, getRepository } from 'typeorm';
import { Category } from '../entities/Category';
import {
  Get,
  JsonController,
  Post,
  OnUndefined,
  NotFoundError,
  BadRequestError,
  Patch,
  Param,
  Body,
  Put
} from 'routing-controllers';
import { validate, ValidationError } from 'class-validator';

type CategoryResponse = Category | undefined;

@JsonController()
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
  @Get('/categories')
  getAll() {
    return this.categoryRepository.find();
  }

  /**
   * GET /categories/:categoryId
   *
   * Gets a category based on its Id
   * @param id
   */
  @Get('/categories/:categoryId')
  async getOne(@Param('categoryId') id: number) {
    const category: CategoryResponse = await this.categoryRepository.findOne(
      id
    );
    if (category) {
      return category;
    } else {
      throw new NotFoundError('Category not found');
    }
  }

  /**
   * POST /categories
   *
   * Creates a category based on the request's body
   * @param category
   */
  @Post('/categories')
  async create(@Body() category: Category) {
    const errors: ValidationError[] = await validate(category, {
      whitelist: true
    });
    if (errors.length) {
      throw new BadRequestError(formatValidationMessage(errors).toString());
    } else {
      await this.categoryRepository.save(category);
      return {
        status: 'Success!'
      };
    }
  }

  /**
   * PATCH /categories
   *
   * Updates a category based on the request's body and id paramter
   * @param id
   * @param newCategory
   */
  @Patch('/categories/:categoryId')
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
        throw new BadRequestError(formatValidationMessage(errors).toString());
      } else {
        await this.categoryRepository.update(id, newCategory);
        return {
          status: 'Success!'
        };
      }
    } else {
      throw new NotFoundError('Category not found');
    }
  }
}
