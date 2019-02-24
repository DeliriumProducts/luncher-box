import faker from 'faker';
import { Server } from 'http';
import request from 'supertest';
import { Connection, getRepository, Repository } from 'typeorm';
import { initServer } from '../src';
import { dbConnection as getDbConnection, redisConnection } from '../src/connections';
import { User } from '../src/entities';

let server: Server;
let userRepository: Repository<User>;
let dbConnection: Connection;

beforeAll(async () => {
  server = await initServer();
  dbConnection = await getDbConnection();
  userRepository = getRepository(User);
});

describe('POST /auth/register', () => {
  it('adds a valid user to the database when registering', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: faker.name.findName(),
      password: 'FAKEpassword123VALID-REGISTRATION'
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

  it('throws an error when registering a user with an invalid email', async () => {
    const userCredentials: Partial<User> = {
      email: 'this_is-not_an_email123',
      name: faker.name.findName(),
      password: 'FAKEpassword123INVALID-EMAIL'
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

    const users = await userRepository.find();

    const { password, ...data } = userCredentials;

    expect(users).not.toEqual(expect.arrayContaining([expect.objectContaining(data)]));
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

    const users = await userRepository.find();

    const { password, ...data } = userCredentials;

    expect(users).not.toEqual(expect.arrayContaining([expect.objectContaining(data)]));
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

    const users = await userRepository.find();

    const { password, ...data } = userCredentials;

    expect(users).not.toEqual(expect.arrayContaining([expect.objectContaining(data)]));
  });

  it('throws an error when registering a user with a duplicate email', async () => {
    const userCredentials: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: 'John Doe',
      password: 'FAKEpassword123DUPLICATE-EMAIL'
    };

    await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(200);

    const { password, ...data } = userCredentials;
    data.isVerified = false;

    const user = await userRepository.find({ where: { data } });

    const userCredentials1: Partial<User> = {
      ...userCredentials,
      name: 'Sam Doe'
    };

    const { body } = await request(server)
      .post('/auth/register')
      .send(userCredentials1)
      .expect(422);

    expect(body).toEqual({
      name: 'DuplicateError',
      message: 'Duplicate User entry!'
    });

    const user1 = await userRepository.find({ where: { data } });

    expect(user1).toEqual(user);
  });
});

describe('GET /confirm/:tokenId', () => {
  it('deletes the token from Redis after confirmation', async () => {
    const userCredentials: Partial<User> = {
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: 'FAKEpassword123REDIS-DELETE'
    };

    const { body: confirmationURL } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(200);

    await request(server)
      .get(confirmationURL)
      .expect(302);

    const token = confirmationURL.split('/')[2];

    expect(await redisConnection.get(token)).toEqual(null);
  });

  it('confirms the user in the database', async () => {
    const userCredentials: Partial<User> = {
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: 'FAKEpassword123CONFIRM-USER'
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

    const users1 = await userRepository.find();

    data.isVerified = true;

    expect(users1).toEqual(expect.arrayContaining([expect.objectContaining(data)]));
  });
});

describe('POST /auth/login', () => {
  const registeredUserCredentials: Partial<User> = {
    name: faker.name.findName(),
    email: faker.internet.exampleEmail(),
    password: 'FAKEpassword123INVALID-LOGIN'
  };

  beforeAll(async () => {
    await request(server)
      .post('/auth/register')
      .send(registeredUserCredentials);
  });

  it('logs a user in after confirming token', async () => {
    const userCredentials: Partial<User> = {
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: 'FAKEpassword123LOGIN-USER'
    };

    const { body: confirmationURL } = await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(200);

    await request(server)
      .get(confirmationURL)
      .expect(302);

    const { body, header } = await request(server)
      .post('/auth/login')
      .send(userCredentials)
      .expect(200);

    expect(body).toEqual('User logged in!');

    const cookie = header['set-cookie'][0]
      .split(/,(?=\S)/)
      .map((item: string) => item.split(';')[0]);

    const { body: isLoggedIn } = await request(server)
      .get('/auth')
      .set('Cookie', cookie)
      .expect(200);

    expect(isLoggedIn).toEqual(true);
  });

  it('throws an error when logging in with an incorrect password', async () => {
    const { text } = await request(server)
      .post('/auth/login')
      .send({ ...registeredUserCredentials, password: 'WRONGpassword123' })
      .expect(401);

    expect(text).toEqual('Unauthorized');
  });

  it('throws an error when logging in with an unconfirmed user', async () => {
    const { text } = await request(server)
      .post('/auth/login')
      .send(registeredUserCredentials)
      .expect(401);

    expect(text).toEqual('Unauthorized');
  });

  it('throws an error when logging in with an non-existing user', async () => {
    const { text } = await request(server)
      .post('/auth/login')
      .send({
        name: faker.name.findName(),
        email: faker.internet.exampleEmail(),
        password: 'QualityPassword123'
      })
      .expect(401);

    expect(text).toEqual('Unauthorized');
  });
});

afterAll(async () => {
  await redisConnection.quit();
  await dbConnection.close();
});
