import { Request } from 'express';
import { Action } from 'routing-controllers';

export const authorizationChecker = async (action: Action) => {
  const req: Request = action.request;
  return req.isAuthenticated();
};
