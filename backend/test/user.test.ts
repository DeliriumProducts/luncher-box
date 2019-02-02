import { getRepository, Repository } from 'typeorm';
import request from 'supertest';
import { initServer } from '../src';
import { Server } from 'http';
import { redisConnection, store } from '../src/connections';
import { User } from '../src/entities';
import faker from 'faker';
import { Response } from 'superagent';

let server: Server;
let userRepository: Repository<User>;

beforeAll(async () => {
  server = await initServer();
  userRepository = getRepository(User);
});

describe('Registering users', () => {
  it('adds a valid user to the database when registering', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: 'FAKEpassword123'
    };

    console.log(userCredentials.email);

    await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(200)
      .then((res: Response) => {
        expect(res.body).toEqual('Verification email sent!');
      });

    const users = await userRepository.find();

    const { password, ...data } = userCredentials;
    data.isVerified = false;

    expect(users).toMatchObject([data]);
  });

  it('throws an error when registering a user with an invalid email', async () => {
    const userCredentials: Partial<User> = {
      email: 'this_is-not_an_email123',
      name: 'John Doe',
      password: 'FAKEpassword123'
    };

    return request(server)
      .post('/auth/register')
      .send(userCredentials)
      .then((res: Response) => {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          errors: ['email must be an email'],
          name: 'NotValidError',
          message: 'User not valid!'
        });
      });
  });
});

// describe('Logging in users', () => {
//   it('logs a user in after confriming', async () => {
//     const userCredentials: Partial<User> = {
//       email: faker.internet.email(),
//       password: faker.internet.password(8, false, /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/)
//     };

//     await request(server)
//       .post('/auth/register')
//       .send(userCredentials)
//       .expect(200)
//       .then((res: Response) => {
//         expect(res.body).toEqual('Verification email sent!');
//       });

//     const users = await userRepository.find();

//     const { password: _, ...data } = userCredentials;
//     data.isVerified = false;

//     return expect(users).toMatchObject([data]);
//   });
// });

afterAll(async () => {
  await redisConnection.quit();
});
