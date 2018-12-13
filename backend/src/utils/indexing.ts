/**
 * Indexing function for nested values
 * For reference check:
 * https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
 * and
 * https://twitter.com/sharifsbeat/status/843187365367767046
 * @param path
 * @param obj
 */
export default (path: any[], obj: {}): any =>
  path.reduce((xs, x): any => (xs && xs[x] ? xs[x] : null), obj);
