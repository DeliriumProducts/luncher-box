import { ValidationError } from 'class-validator';

/**
 * Takes an array of ValidationErrors which are returned by class-validator and formats them in a neater way.
 * @param errors
 */
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
