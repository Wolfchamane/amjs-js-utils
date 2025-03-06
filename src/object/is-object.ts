/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Evaluates if the {value} argument is really an object, i.e.:
 * ```typescript
 * import { isObject } from '@amjs/js-utils';
 * console.log(isObject());         // false
 * console.log(isObject(null));     // false
 * console.log(isObject(1));        // false
 * console.log(isObject(-0));       // false
 * console.log(isObject(true));     // false
 * console.log(isObject(false));    // false
 * console.log(isObject(''));       // false
 * console.log(isObject('text'));   // false
 * console.log(isObject([]));       // false
 * console.log(isObject({}));       // true
 * ```
 *
 * @param   {any}       value To be evaluated
 * @return  {Boolean}   `true` if {value} is not `null`, `undefined` and `Array` or any other different to object.
 */
export const isObject = (value: any): boolean =>
    value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value);
/* eslint-enable @typescript-eslint/no-explicit-any */
