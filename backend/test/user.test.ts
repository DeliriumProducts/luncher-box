import faker from 'faker';
import { Server } from 'http';
import request from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { initServer } from '../src';
import { redisConnection } from '../src/connections';
import { User } from '../src/entities';

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
      .expect(200);

    const users = await userRepository.find();

    const { password, ...data } = userCredentials;
    data.isVerified = false;

    expect(users).toEqual(expect.arrayContaining([expect.objectContaining(data)]));
  });
});

describe('Not registering users with invalid fields', () => {
  it('throws an error when registering a user with an invalid email', async () => {
    const userCredentials: Partial<User> = {
      email: 'this_is-not_an_email123',
      name: faker.name.findName(),
      password: 'FAKEpassword123'
    };

    const { body } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(400);

    expect(body).toEqual({
      errors: ['email must be an email'],
      name: 'NotValidError',
      message: 'User not valid!'
    });
  });

  it('throws an error when registering a user with an invalid password', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: faker.name.findName(),
      password: 'remember'
    };

    const { body } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(400);

    expect(body).toEqual({
      errors: [
        // tslint:disable
        'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
        // tslint:enable
      ],
      name: 'NotValidError',
      message: 'User not valid!'
    });
  });

  it('throws an error when registering a user with all fields invalid', async () => {
    const userCredentials: Partial<User> = {
      email: 'not-an-email',
      name: '',
      password: 'badpass'
    };

    const { body } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(400);

    expect(body).toEqual({
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

  it('throws an error when registering a user with a duplicate email', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: 'John Doe',
      password: 'FAKEpassword123'
    };

    await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(200);

    const users = await userRepository.find();

    const { password, ...data } = userCredentials;
    data.isVerified = false;

    expect(users).toEqual(expect.arrayContaining([expect.objectContaining(data)]));

    const { body } = await request(server)
      .post('/auth/register')
      .send({ ...userCredentials, name: 'Sam Doe' })
      .expect(422);

    expect(body).toEqual({
      name: 'DuplicateError',
      message: 'Duplicate User entry!'
    });

    const users1 = await userRepository.find();

    expect(users1).toEqual(users);
  });
});

describe('Not registering users with empty fields', () => {
  it('throws an error when registering a user with an empty email', async () => {
    const userCredentials: Partial<User> = {
      email: '',
      name: faker.name.findName(),
      password: 'FAKEpassword123'
    };

    const { body } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(400);

    expect(body).toEqual({
      errors: ['email must be an email'],
      name: 'NotValidError',
      message: 'User not valid!'
    });
  });

  it('throws an error when registering a user with an empty name', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: '',
      password: 'FAKEpassword123'
    };

    const { body } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(400);

    expect(body).toEqual({
      errors: ['name must be longer than or equal to 1 characters'],
      name: 'NotValidError',
      message: 'User not valid!'
    });
  });

  it('throws an error when registering a user with an empty password', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: 'John Doe',
      password: ''
    };

    const { body } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(400);

    expect(body).toEqual({
      errors: [
        // tslint:disable
        'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
        // tslint:enable
      ],
      name: 'NotValidError',
      message: 'User not valid!'
    });
  });

  it('throws an error when registering a user with all fields empty', async () => {
    const userCredentials: Partial<User> = {
      email: '',
      name: '',
      password: ''
    };

    const { body } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(400);

    expect(body).toEqual({
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

describe('Logging in registered users', () => {
  it('logs a user in after confriming email', async () => {
    const userCredentials: Partial<User> = {
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: 'FAKEpassword123'
    };

    const { body: confirmationURL } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(200);

    const { password, ...data } = userCredentials;
    data.isVerified = false;

    const users = await userRepository.find();

    expect(users).toEqual(expect.arrayContaining([expect.objectContaining(data)]));

    await request(server)
      .get(confirmationURL)
      .expect(302);

    const res = await request(server)
      .post('/auth/login')
      .send(userCredentials)
      .expect(200);

    const cookie = res.header['set-cookie'][0]
      .split(/,(?=\S)/)
      .map((item: string) => item.split(';')[0]);

    const { body: isLoggedIn } = await request(server)
      .get('/auth')
      .set('Cookie', cookie)
      .expect(200);

    expect(isLoggedIn).toEqual(true);

    const users1 = await userRepository.find();

    data.isVerified = true;

    expect(users1).toEqual(expect.arrayContaining([expect.objectContaining(data)]));
  });
});

afterAll(async () => {
  await redisConnection.quit();
});
