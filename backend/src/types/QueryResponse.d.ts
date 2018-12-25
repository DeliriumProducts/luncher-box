/**
 * Used for when querying an entity from TypeORM when using .findOne (or methods that can return undefined)
 */
export type QueryResponse<T> = T | undefined;
