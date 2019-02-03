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

describe('Registering users with valid fields', () => {
  it('adds a valid user to the database when registering', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: faker.name.findName(),
      password: 'FAKEpassword123'
    };

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
});

describe('Not registering users with invalid fields', () => {
  it('throws an error when registering a user with an invalid email', async () => {
    const userCredentials: Partial<User> = {
      email: 'this_is-not_an_email123',
      name: faker.name.findName(),
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

  it('throws an error when registering a user with an invalid password', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: faker.name.findName(),
      password: 'remember'
    };

    return request(server)
      .post('/auth/register')
      .send(userCredentials)
      .then((res: Response) => {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          errors: [
            // tslint:disable
            'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
            // tslint:enable
          ],
          name: 'NotValidError',
          message: 'User not valid!'
        });
      });
  });

  it('throws an error when registering a user with all fields invalid', async () => {
    const userCredentials: Partial<User> = {
      email: 'not-an-email',
      name: '',
      password: 'badpass'
    };

    return request(server)
      .post('/auth/register')
      .send(userCredentials)
      .then((res: Response) => {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          errors: [
            'name must be longer than or equal to 1 characters',
            'email must be an email',
            // tslint:disable
            'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
            // tslint:enable
          ],
          name: 'NotValidError',
          message: 'User not valid!'
        });
      });
  });

  it('throws an error when registering a user with a duplicate email', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: 'John Doe',
      password: 'FAKEpassword123'
    };

    await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .then((res: Response) => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual('Verification email sent!');
      });

    return request(server)
      .post('/auth/register')
      .send({ ...userCredentials, name: 'Sam Doe' })
      .then((res: Response) => {
        expect(res.status).toEqual(422);
        expect(res.body).toEqual({
          name: 'DuplicateError',
          message: 'Duplicate User entry!'
        });
      });
  });
});

describe('Not registering users with empty fields', () => {
  it('throws an error when registering a user with an empty email', async () => {
    const userCredentials: Partial<User> = {
      email: '',
      name: faker.name.findName(),
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

  it('throws an error when registering a user with an empty name', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: '',
      password: 'FAKEpassword123'
    };

    return request(server)
      .post('/auth/register')
      .send(userCredentials)
      .then((res: Response) => {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          errors: ['name must be longer than or equal to 1 characters'],
          name: 'NotValidError',
          message: 'User not valid!'
        });
      });
  });

  it('throws an error when registering a user with an empty password', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: 'John Doe',
      password: ''
    };

    return request(server)
      .post('/auth/register')
      .send(userCredentials)
      .then((res: Response) => {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          errors: [
            // tslint:disable
            'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
            // tslint:enable
          ],
          name: 'NotValidError',
          message: 'User not valid!'
        });
      });
  });

  it('throws an error when registering a user with all fields empty', async () => {
    const userCredentials: Partial<User> = {
      email: '',
      name: '',
      password: ''
    };

    return request(server)
      .post('/auth/register')
      .send(userCredentials)
      .then((res: Response) => {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          errors: [
            'name must be longer than or equal to 1 characters',
            'email must be an email',
            // tslint:disable
            'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
            // tslint:enable
          ],
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
