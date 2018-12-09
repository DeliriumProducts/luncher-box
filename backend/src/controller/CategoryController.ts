import { getRepository, Repository, getConnectionManager } from "typeorm";
import { Category } from "../entity/Category";
import { Get, JsonController } from "routing-controllers";

@JsonController()
export class CategoryController {
    private categoryRepository: Repository<Category>;

    constructor() {
        this.categoryRepository = getConnectionManager().get().getRepository(Category);
    }


    @Get('/categories')
    getAll() {

    }
}
