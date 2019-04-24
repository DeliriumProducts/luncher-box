import faker from 'faker';
import { Server } from 'http';
import request from 'supertest';
import { getRepository, Repository, MoreThan } from 'typeorm';
import { initServer } from '../src';
import { redisConnection } from '../src/connections';
import { User } from '../src/entities';
import { createInitialAdmin } from '../src/utils';
import { INITIAL_ADMIN_PASS } from '../src/config';

let server: Server;
let userRepository: Repository<User>;

beforeAll(async () => {
  server = await initServer();
  userRepository = getRepository(User);
});

describe('POST /staff/auth/register', () => {
  it('adds a valid user to the database when registering', async () => {
    const user: Partial<User> = {
      email: 'validuser' + faker.internet.exampleEmail(),
      name: faker.name.findName(),
      password: 'FAKEpassword123VALID-REGISTRATION'
    };

    await request(server)
      .post('/staff/auth/register')
      .send(user)
      .expect(200);

    const { password, ...userWithoutPassword } = user;

    const userQuery = await userRepository.findOne({ where: { ...userWithoutPassword } });

    expect(userQuery).toMatchObject(userWithoutPassword);
  });

  it('throws an error when registering a user with an invalid email', async () => {
    const user: Partial<User> = {
      email: 'this_is-not_an_email123',
      name: faker.name.findName(),
      password: 'FAKEpassword123INVALID-EMAIL'
    };

    const { body } = await request(server)
      .post('/staff/auth/register')
      .send(user)
      .expect(400);

    expect(body).toEqual({
      errors: ['email must be an email'],
      name: 'NotValidError',
      message: 'User not valid!'
    });

    const { password, ...userWithoutPassword } = user;

    const userQuery = await userRepository.findOne({ where: { ...userWithoutPassword } });

    expect(userQuery).not.toBeDefined();
  });

  it('throws an error when registering a user with an invalid password', async () => {
    const user: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: faker.name.findName(),
      password: 'remember'
    };

    const { body } = await request(server)
      .post('/staff/auth/register')
      .send(user)
      .expect(400);

    expect(body).toEqual({
      errors: [
        // tslint:disable-next-line
        'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
      ],
      name: 'NotValidError',
      message: 'User not valid!'
    });

    const { password, ...userWithoutPassword } = user;

    const userQuery = await userRepository.findOne({ where: { ...userWithoutPassword } });

    expect(userQuery).not.toBeDefined();
  });

  it('throws an error when registering a user with all fields invalid', async () => {
    const user: Partial<User> = {
      email: 'not-an-email',
      name: '',
      password: 'badpass'
    };

    const { body } = await request(server)
      .post('/staff/auth/register')
      .send(user)
      .expect(400);

    expect(body).toEqual({
      errors: [
        'name must be longer than or equal to 1 characters',
        'email must be an email',
        // tslint:disable-next-line
        'Password must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long'
      ],
      name: 'NotValidError',
      message: 'User not valid!'
    });

    const { password, ...userWithoutPassword } = user;

    const userQuery = await userRepository.findOne({ where: { ...userWithoutPassword } });

    expect(userQuery).not.toBeDefined();
  });

  it('throws an error when registering a user with a duplicate email', async () => {
    const user: Partial<User> = {
      email: faker.internet.exampleEmail(),
      name: 'John Doe',
      password: 'FAKEpassword123DUPLICATE-EMAIL'
    };

    await request(server)
      .post('/staff/auth/register')
      .send(user)
      .expect(200);

    const duplicateUser: Partial<User> = {
      ...user,
      name: 'Sam Doe'
    };

    const { body } = await request(server)
      .post('/staff/auth/register')
      .send(duplicateUser)
      .expect(422);

    expect(body).toEqual({
      name: 'DuplicateError',
      message: 'Duplicate User entry!'
    });

    const { password, ...userWithoutPassword } = duplicateUser;

    const userQuery = await userRepository.findOne({ where: { ...userWithoutPassword } });

    expect(userQuery).not.toBeDefined();
  });
});

describe('GET /staff', () => {
  let cookie: string;

  beforeAll(async () => {
    await createInitialAdmin();

    const user: Partial<User> = {
      email: 'admin@deliriumproducts.me',
      password: INITIAL_ADMIN_PASS
    };

    const { header } = await request(server)
      .post('/staff/auth/login')
      .send(user);

    cookie = header['set-cookie'][0].split(/,(?=\S)/).map((item: string) => item.split(';')[0]);
  });

  it('gets all the staff members', async () => {
    const { body } = await request(server)
      .get('/staff')
      .set('Cookie', cookie)
      .expect(200);

    const staffQuery = await userRepository.find();

    expect(staffQuery).toMatchObject(body);
  });

  it('gets all the staff members on a given page', async () => {
    const { body } = await request(server)
      .get('/staff?page=1')
      .set('Cookie', cookie)
      .expect(200);

    const staffQuery = await userRepository.find({
      skip: 0,
      take: 0
    });

    expect(staffQuery).toMatchObject(body);
  });

  it('gets all the staff members with a limit', async () => {
    const { body } = await request(server)
      .get('/staff?limit=1')
      .set('Cookie', cookie)
      .expect(200);

    expect(body).toHaveLength(1);

    const staffQuery = await userRepository.find({
      take: 1
    });

    expect(staffQuery).toMatchObject(body);
  });
});

describe('GET /confirm/:tokenId', () => {
  it('confirms the user in the database', async () => {
    const user: Partial<User> = {
      name: faker.name.findName(),
      email: 'CONFIRM' + faker.internet.exampleEmail(),
      password: 'FAKEpassword123CONFIRM-USER'
    };

    const { body: confirmationURL } = await request(server)
      .post('/staff/auth/register')
      .send(user)
      .expect(200);

    const { password, ...userWithoutPassword } = user;

    const userQuery = await userRepository.findOne({ where: { ...userWithoutPassword } });

    expect(userQuery).toMatchObject({
      ...userWithoutPassword,
      isVerified: false
    });

    await request(server)
      .get(confirmationURL)
      .expect(302);

    const userQuery1 = await userRepository.findOne({ where: { ...userWithoutPassword } });

    expect(userQuery1).toMatchObject({
      ...userWithoutPassword,
      isVerified: true
    });
  });

  it('deletes the token from Redis after confirmation', async () => {
    const user: Partial<User> = {
      name: faker.name.findName(),
      email: 'DELETE' + faker.internet.exampleEmail(),
      password: 'FAKEpassword123REDIS-DELETE'
    };

    const { body: confirmationURL } = await request(server)
      .post('/staff/auth/register')
      .send(user)
      .expect(200);

    await request(server)
      .get(confirmationURL)
      .expect(302);

    const token = confirmationURL.split('/')[2];

    expect(await redisConnection.get(token)).toEqual(null);
  });
});

describe('POST /staff/auth/login', () => {
  const registeredUser: Partial<User> = {
    name: faker.name.findName(),
    email: 'REGISTERLOGIN' + faker.internet.exampleEmail(),
    password: 'FAKEpassword123REGISTERAUTH'
  };

  beforeAll(async () => {
    await request(server)
      .post('/staff/auth/register')
      .send(registeredUser)
      .expect(200);
  });

  it('logs a user in after confirming token', async () => {
    const user: Partial<User> = {
      name: faker.name.findName(),
      email: 'login1' + faker.internet.exampleEmail(),
      password: 'FAKEpassword123LOGIN-USER'
    };

    const { body: confirmationURL } = await request(server)
      .post('/staff/auth/register')
      .send(user)
      .expect(200);

    await request(server)
      .get(confirmationURL)
      .expect(302);

    const { body, header } = await request(server)
      .post('/staff/auth/login')
      .send(user)
      .expect(200);

    expect(body).toEqual('User logged in!');

    const cookie = header['set-cookie'][0]
      .split(/,(?=\S)/)
      .map((item: string) => item.split(';')[0]);

    const { body: isLoggedIn } = await request(server)
      .get('/staff/auth')
      .set('Cookie', cookie)
      .expect(200);

    expect(isLoggedIn).toEqual(true);
  });

  it('throws an error when logging in with an unconfirmed user', async () => {
    const { text } = await request(server)
      .post('/staff/auth/login')
      .send(registeredUser)
      .expect(401);

    expect(text).toEqual('Unauthorized');
  });

  it('throws an error when logging in with an incorrect password', async () => {
    const { text } = await request(server)
      .post('/staff/auth/login')
      .send({ ...registeredUser, password: 'WRONGpassword123' })
      .expect(401);

    expect(text).toEqual('Unauthorized');
  });

  it('throws an error when logging in with an non-existing user', async () => {
    const user: Partial<User> = {
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: 'QualityPassword123'
    };

    const { text } = await request(server)
      .post('/staff/auth/login')
      .send(user)
      .expect(401);

    expect(text).toEqual('Unauthorized');
  });
});

describe('GET /staff/auth/logout', () => {
  const registeredUser: Partial<User> = {
    name: faker.name.findName(),
    email: 'logout' + faker.internet.exampleEmail(),
    password: 'FAKEpassword123LOGOUT-LOGIN'
  };
  let cookie: string;

  beforeAll(async () => {
    const { body: confirmationURL } = await request(server)
      .post('/staff/auth/register')
      .send(registeredUser)
      .expect(200);

    await request(server)
      .get(confirmationURL)
      .expect(302);

    const { header } = await request(server)
      .post('/staff/auth/login')
      .send(registeredUser)
      .expect(200);

    cookie = header['set-cookie'][0].split(/,(?=\S)/).map((item: string) => item.split(';')[0]);
  });

  it('logs a user out after logging in', async () => {
    const { body } = await request(server)
      .get('/staff/auth/logout')
      .set('Cookie', cookie)
      .expect(200);

    expect(body).toEqual('User logged out!');
  });

  it('throws an error when logging out without logging in', async () => {
    const { body } = await request(server)
      .get('/staff/auth/logout')
      .expect(200);

    expect(body).toEqual('Login to logout!');
  });
});

afterAll(async () => {
  await redisConnection.quit();
});
