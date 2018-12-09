import { Product } from './../entities/Product';
import { JsonController, Get } from 'routing-controllers';
import { getManager } from 'typeorm';

@JsonController()
export class ProductController {
  @Get('/products')
  getAll() {
    return getManager().find(Product);
  }
}
