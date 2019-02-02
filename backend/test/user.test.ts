import { getRepository, Repository } from 'typeorm';
import request from 'supertest';
import { startServer, stopServer } from '../src';
import { Server } from 'http';
import { dbConnection, redisConnection } from '../src/connections';
import { User } from '../src/entities';

let server: Server;
let userRepository: Repository<User>;

beforeAll(async () => {
  server = await startServer();
  await dbConnection();
  userRepository = getRepository(User);
});

describe('Creating users', () => {
  it('successfully adds a valid user to the database when registering', async () => {
    const user = {
      email: 'john@icloud.com',
      name: 'John Doe',
      password: 'FAKEpassword123'
    };

    await request(server)
      .post('/auth/register')
      .send(user);

    const users = await userRepository.find();

    return expect(users).toEqual([user]);
  });
});

afterAll(() => {
  redisConnection.quit();
  stopServer();
});
