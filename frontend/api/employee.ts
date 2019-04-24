import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Credentials } from '../interfaces';

export class EmployeeAPI {
  static async login(credentials: Credentials) {
    const response = await axios.post(
      `${BACKEND_URL}/employee/auth/login`,
      credentials,
      {
        withCredentials: true
      }
    );

    return response;
  }

  static async register(credentials: Credentials) {
    const response = await axios.post(
      `${BACKEND_URL}/employee/auth/register`,
      credentials
    );

    return response;
  }

  static async logout() {
    const response = await axios.get(`${BACKEND_URL}/employee/auth/logout`, {
      withCredentials: true
    });

    return response;
  }

  static async isAuthenticated(cookie?: any) {
    let opts = {};

    if (cookie) {
      opts = { headers: { cookie } };
    }

    const isAuthenticated: boolean = (await axios.get(
      `${BACKEND_URL}/employee/auth`,
      {
        withCredentials: true,
        ...opts
      }
    )).data;

    return isAuthenticated;
  }
}
