import { authorizationChecker, capitalizeFirstLetter, createInitialAdmin } from '../src/utils';
import { Repository, getRepository } from 'typeorm';
import { User } from '../src/entities';
import { dbConnection } from '../src/connections';

describe('Capitalize First Letter', () => {
  const str = 'this is an example sentence';
  let result: string;

  beforeAll(() => {
    result = capitalizeFirstLetter(str);
  });

  it('returns a string', () => {
    expect(typeof result).toEqual('string');
  });

  it('returns a string with the first letter capitalized', () => {
    expect(/[A-Z]/.test(result.charAt(0))).toEqual(true);
  });
});

describe('Authorization Checker', () => {
  it('lets Admins in a route with Admin', () => {
    const isAllowed = authorizationChecker(
      {
        request: {
          isAuthenticated() {
            return true;
          },
          user: {
            role: 'Admin'
          }
        },
        response: {}
      },
      ['Admin']
    );

    expect(isAllowed).toBe(true);
  });

  it('lets Admins in any route', () => {
    const isAllowed = authorizationChecker(
      {
        request: {
          isAuthenticated() {
            return true;
          },
          user: {
            role: 'Admin'
          }
        },
        response: {}
      },
      ['Waiter', 'Cook']
    );

    expect(isAllowed).toBe(true);
  });

  it(`doesn't let non-admins access Admin routes`, () => {
    const isAllowed = authorizationChecker(
      {
        request: {
          isAuthenticated() {
            return true;
          },
          user: {
            role: 'Waiter'
          }
        },
        response: {}
      },
      ['Admin']
    );

    expect(isAllowed).toBe(false);
  });

  it('lets Waiters in a route with Waiters', () => {
    const isAllowed = authorizationChecker(
      {
        request: {
          isAuthenticated() {
            return true;
          },
          user: {
            role: 'Waiter'
          }
        },
        response: {}
      },
      ['Waiter']
    );

    expect(isAllowed).toBe(true);
  });

  it(`doesn't let non-authenticated users access protected routes`, () => {
    const isAllowed = authorizationChecker(
      {
        request: {
          isAuthenticated() {
            return false;
          },
          user: {
            role: 'Waiter'
          }
        },
        response: {}
      },
      []
    );

    expect(isAllowed).toBe(false);
  });
});

describe('Create Initial Admin', () => {
  let userRepository: Repository<User>;

  beforeAll(async () => {
    await dbConnection();
    userRepository = getRepository(User);
  });

  it('creates the first admin', async () => {
    await createInitialAdmin();

    const user = await userRepository.findOne({
      where: {
        email: 'admin@deliriumproducts.me'
      }
    });

    expect(user).toBeDefined();
  });

  it(`doesn't create a new admin after the first one`, async () => {
    await createInitialAdmin();

    const users = await userRepository.find({
      where: {
        email: 'admin@deliriumproducts.me'
      }
    });

    expect(users).toHaveLength(1);
  });
});
