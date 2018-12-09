import { ValidationError } from 'class-validator';

export default (errors: ValidationError[]) => {
  const formattedErrors: Array<{}> = [];
  for (const error of errors) {
    formattedErrors.push(error.constraints);
  }

  return formattedErrors;
};
