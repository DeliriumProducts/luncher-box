import { ValidationError } from 'class-validator';

export default (errors: ValidationError[]): string => {
  let formattedErrors: string = '';
  for (const error of errors) {
    const constraints = error.constraints;
    for (const constraint of Object.values(constraints)) {
      if (constraint) {
        formattedErrors += constraint + '; ';
      }
    }
  }

  return formattedErrors;
};
