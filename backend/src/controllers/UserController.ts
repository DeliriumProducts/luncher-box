import { JsonController, Get } from 'routing-controllers';

@JsonController()
export class UserController {
  @Get('/hello')
  hello() {
    return {
      hello: 'nigger'
    };
  }
}
