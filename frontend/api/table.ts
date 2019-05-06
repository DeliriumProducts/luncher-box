import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Table } from '../interfaces';

export class TableAPI {
  static opts = {
    withCredentials: true
  };

  static async getAll(
    opts: { since?: number; page?: number; limit?: number } = {}
  ) {
    if (!opts.limit) {
      opts.limit = 0;
    }

    if (opts.since) {
      const tables: Table[] = (await axios.get(
        `${BACKEND_URL}/tables?since=${opts.since}&limit=${opts.limit}`
      )).data;

      return tables;
    }

    if (opts.page) {
      const tables: Table[] = (await axios.get(
        `${BACKEND_URL}/tables?page=${opts.page}&limit=${opts.limit}`
      )).data;

      return tables;
    } else {
      const tables: Table[] = (await axios.get(
        `${BACKEND_URL}/tables?limit=${opts.limit}`
      )).data;

      return tables;
    }
  }

  static async getOne(id: number, relations?: boolean) {
    let table: Table;
    if (relations) {
      table = (await axios.get(`${BACKEND_URL}/tables/${id}?relations=1`)).data;
    } else {
      table = (await axios.get(`${BACKEND_URL}/tables/${id}`)).data;
    }

    return table;
  }

  static async create(table: Table) {
    const response = await axios.post(
      `${BACKEND_URL}/tables`,
      table,
      this.opts
    );

    return response;
  }

  static async edit(table: Table) {
    const { id } = table;
    const response = await axios.put(
      `${BACKEND_URL}/tables/${id}`,
      table,
      this.opts
    );

    return response;
  }

  static async delete(id: number) {
    const response = await axios.delete(
      `${BACKEND_URL}/tables/${id}`,
      this.opts
    );

    return response;
  }
}
