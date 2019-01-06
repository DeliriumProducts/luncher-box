import { Request, Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

/**
 * Used to prevent the bug with no response being sent to the client
 */
@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response, next: (err?: any) => any) {
    const httpCode = error.httpCode || error.status || error.statusCode || 500;

    /**
     * Delete status codes from the body, as they can be accessed from the headers
     * Delete the stack to prevent vulnerabilities
     */
    delete error.httpCode;
    delete error.status;
    delete error.statusCode;
    delete error.stack;

    res.status(httpCode).send(error);
    next();
  }
}
