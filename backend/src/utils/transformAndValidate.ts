import { ValidationError } from 'class-validator';
import { ClassType } from './../types/classtype.d';
import { transformAndValidate } from 'class-transformer-validator';
import formatValidationMessage from './formatValidationMessage';
export default async function(
  cls: ClassType<{}>,
  obj: object
): Promise<[any, string]> {
  let errors: string = '';
  let clsObj: any = {};
  try {
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
