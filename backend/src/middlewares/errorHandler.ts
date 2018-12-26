import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Request, Response } from 'express';

/**
 * Used to prevent the bug with no response being sent to the client
 */
@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: HttpError, req: Request, res: Response, next: (err?: any) => any) {
    const httpCode = error.httpCode || 500;
    delete error.httpCode;
    res.status(httpCode).send(error);
    next();
  }
}
