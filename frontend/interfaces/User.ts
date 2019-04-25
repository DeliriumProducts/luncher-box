import { Role } from '../types';

export interface User {
  id: string;
  key?: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
}
