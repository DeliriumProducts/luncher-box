import { transformAndValidate, TransformValidationOptions } from 'class-transformer-validator';
import deepmerge from 'deepmerge';
import { ClassType } from '../interfaces';
import { TransformAndValidateTuple } from '../types';

/**
 * HOF / Curry func around the transformAndValidate method which can be easily awaited without the need of a try/catch.
 * Returns an array of the finished object and an array of the validation messages.
 *
 * @param cls
 * @param obj
 * @param options
 */
export default <T extends object>(cls: ClassType<T>) => async (
  obj: object | Array<{}>,
  options?: TransformValidationOptions
): TransformAndValidateTuple<T> => {
  const errors: Array<Array<{}> | {}> = [];
  let clsObj: T = new cls();

  const defaultOptions: TransformValidationOptions = {
    validator: {
      whitelist: true
    }
  };

  let modifiedOptions: TransformValidationOptions;
  if (options) {
    modifiedOptions = deepmerge(
      {
        validator: {
          whitelist: true
        }
      },
      options
    );
  } else {
    modifiedOptions = defaultOptions;
  }

  try {
    clsObj = await transformAndValidate(cls, obj, modifiedOptions);
  } catch (exception) {
    for (const error of exception) {
      for (const constraint in error.constraints) {
        if (constraint) {
          errors.push(error.constraints[constraint]);
        }
      }
    }
  }

  return [clsObj, errors];
};
