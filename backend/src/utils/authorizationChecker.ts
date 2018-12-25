import { Action } from 'routing-controllers';
import { Request } from 'express';

export const authorizationChecker = async (action: Action) => {
  const req: Request = action.request;
  return req.isAuthenticated();
};
