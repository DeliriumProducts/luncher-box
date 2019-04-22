import { Request } from 'express';
import { Action } from 'routing-controllers';
import { Role } from '../types';
import { User } from '../entities';

export const authorizationChecker = async (action: Action, r: Role[]) => {
  const req: Request = action.request;
  const user: User = req.user;

  if (!r.length) {
    return req.isAuthenticated();
  } else {
    return (user.role === 'Admin' || r.includes(user.role)) && req.isAuthenticated();
  }
};
