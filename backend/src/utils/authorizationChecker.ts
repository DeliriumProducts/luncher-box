import { Action } from 'routing-controllers';
import { User } from '../entities';
import { Role } from '../types';

/**
 * Checks if a user is logged in AND checks their role
 */
export const authorizationChecker = ({ request: req }: Action, r: Role[]) => {
  const user: User = req.user;

  if (!r.length) {
    return req.isAuthenticated();
  } else {
    return (user.role === 'Admin' || r.includes(user.role)) && req.isAuthenticated();
  }
};
