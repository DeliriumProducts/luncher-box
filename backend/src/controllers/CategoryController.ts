import { getRepository, getManager } from 'typeorm';
import { Category } from '../entities/Category';
import { Get, JsonController } from 'routing-controllers';

@JsonController()
export class CategoryController {
  @Get('/categories')
  async getAll() {
    return await getManager().find(Category);
  }
}
