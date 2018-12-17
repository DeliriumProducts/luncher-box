import { TransformAndValidateTuple } from '../types';
import { ClassType } from '../types/classtype.d';
import { transformAndValidate, TransformValidationOptions } from 'class-transformer-validator';
import deepmerge from 'deepmerge';

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
    /**
     * If validating an array of objects, there is an array of errors for each object, so it has to be iterated over
     *
     * Given the following input: (for class Category)
     * [
     *    {
     *   	  "id":1
     *      "name": "foo"
     *    },
     *    {
     *       "name": "foobar",
     *       "image": "barbaz"
     *    }
     * ]
     *
     * The method wil return:
     *
     * [ <- Array for each object in the array
     *    [ <- an Array of errors
     *      ValidationError {
     *        ...
     *        constraints: [ <- an array of constraints
     *         ...
     *        "name must be longer than 3 characters",
     *        "image must not be undefined"
     *        ]
     *      }
     *    ],
     *    [ <- an Array of errors
     *      ValidationError {
     *        ...
     *        constraints: [ <- an array of constraints
     *         ...
     *        "id must not be undefined"
     *        ]
     *      }
     *    ]
     * ]
     */
    if (Array.isArray(obj)) {
      for (const object of exception) {
        const tempArr: any[] = [];
        for (const error of object) {
          tempArr.push(error.constraints);
        }
        errors.push(tempArr);
      }
    } else {
      for (const error of exception) {
        errors.push(error.constraints);
      }
    }
  }

  return [clsObj, errors];
};
