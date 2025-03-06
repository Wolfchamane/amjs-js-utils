/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject } from './is-object';

/**
 * Finds a value referenced by a dot-chained property tree, i.e.:
 * ```typescript
 * import { dotProp } from '@amjs/js-utils';
 * const ref: Record<string, any> = { key: { param: 'value' } };
 * console.log(dotProp(ref, 'key.param')); // 'value'
 *```
 *
 * Can also modify the value within the reference if third argument is passed, i.e.:
 * ```typescript
 * dotProp(ref, 'key.param', 'foo');
 * console.log(ref.key.param); // 'foo'
 * ```
 *
 * @param   {Object}    ref     Where to find the property
 * @param   {*}         prop    Dot-chained tree property
 * @param   {*}         value   New value to assign
 * @return  {*}         Current value of the property
 */
export const dotProp = (ref: Record<string, any>, prop: string, value?: any): undefined | any => {
    let result: undefined;
    if (prop.lastIndexOf('.') === -1) {
        result = ref[prop];
    } else {
        const splitProp: string[] = prop.split('.');
        const key = splitProp.shift() || '';
        const target = ref[key];
        if (isObject(target)) {
            result = dotProp(target, splitProp.join('.'), value);
        }
    }

    if (value) {
        result = value;
        ref[prop] = value;
    }

    return result;
};
/* eslint-enable @typescript-eslint/no-explicit-any */
