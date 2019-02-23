import { capitalizeFirstLetter } from '../src/utils';

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
