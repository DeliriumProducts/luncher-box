import faker from 'faker';
import { Server } from 'http';
import request from 'supertest';
import { Connection, getRepository, Repository } from 'typeorm';
import { initServer } from '../src';
import { dbConnection as getDbConnection } from '../src/connections';
import { Category, Product, User } from '../src/entities';

let server: Server;
let dbConnection: Connection;
let productRepository: Repository<Product>;
let categoryRepository: Repository<Category>;

beforeAll(async () => {
  server = await initServer();
  dbConnection = await getDbConnection();
  productRepository = getRepository(Product);
  categoryRepository = getRepository(Category);
});

const userCredentials: Partial<User> = {
  name: faker.name.findName(),
  email: faker.internet.exampleEmail(),
  password: 'FAKEpassword123'
};

describe('Creating Categories', () => {
  beforeAll(async () => {
    await request(server)
      .post('/auth/register')
      .send(userCredentials);
  });

  xit('adds valid categories to the database', async () => {
    const category: Partial<Category> = {
      name: 'Burgers',
      image: 'https://image.com/image.com'
    };
  });
});

afterAll(async () => {
  await dbConnection.close();
});
