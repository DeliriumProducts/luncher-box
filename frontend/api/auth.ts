import axios from 'axios';
import { BACKEND_URL } from './../config';
import { Credentials } from './../types';

export class AuthAPI {
  static async login(credentials: Credentials) {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, credentials);

    return response;
  }

  static async register(credentials: Credentials) {
    const response = await axios.post(
      `${BACKEND_URL}/auth/register`,
      credentials
    );

    return response;
  }

  static async isAuthenticated(cookie?: any) {
    let opts = {};
    if (cookie) {
      opts = { headers: { cookie } };
    }
    const isAuthenticated: boolean = (await axios.get(`${BACKEND_URL}/auth`, {
      withCredentials: true,
      ...opts
    })).data;

    return isAuthenticated;
  }
}
