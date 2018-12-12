/**
 * Type which is used for classes
 */
export interface ClassType<T> {
  new (...args: any[]): T;
}
