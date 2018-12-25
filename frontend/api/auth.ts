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

  static async isAuthenticated() {
    const isAuthenticated: boolean = (await axios.get(`${BACKEND_URL}/auth`))
      .data;

    return isAuthenticated;
  }
}
