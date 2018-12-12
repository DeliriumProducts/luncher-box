import { ValidationError } from 'class-validator';
import { ClassType } from './../types/classtype.d';
import {
  transformAndValidate,
  TransformValidationOptions
} from 'class-transformer-validator';
import formatValidationMessage from './formatValidationMessage';

/**
 * Wrapper around the transformAndValidate method which can be easily awaited without the need of a try/catch.
 * Returns an array of the finished object and an array of the validation messages.
 *
 * @param cls
 * @param obj
 * @param options
 */
export default async function(
  cls: ClassType<{}>,
  obj: object,
  options?: TransformValidationOptions
): Promise<[any, string]> {
  let errors: string = '';
  let clsObj: any = {};

  try {
    clsObj = await transformAndValidate(cls, obj, options);
  } catch (err) {
    /**
     * If validating an array of objects, the method returns an array of errors
     */
    if (err.isArray) {
      errors = formatValidationMessage(err[0]);
    } else {
      errors = formatValidationMessage(err);
    }
  }

  return [clsObj, errors];
}
