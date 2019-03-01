import { EntityError } from './EntityError';

/**
 * Used in the transformAndValidate function
 * Returns a promise that can be awaited
 */
export type TransformAndValidateTuple<T> = Promise<[T, EntityError]>;
