import { JsonController, Get } from 'routing-controllers';

@JsonController()
export class UserController {
  @Get('/hello')
  helloWorld() {
    return {
      uwu: 'nigger'
    };
  }
}
