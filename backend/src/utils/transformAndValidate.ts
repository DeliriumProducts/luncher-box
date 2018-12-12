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
    const a = {
      validator: {
        whitelist: true
      },
      ...options
    };

    clsObj = await transformAndValidate(cls, obj, {
      validator: {
        whitelist: true
      }
    });
  } catch (err) {
    errors = formatValidationMessage(err[0]);
  }

  return [clsObj, errors];
}
