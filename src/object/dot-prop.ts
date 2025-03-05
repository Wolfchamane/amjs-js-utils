/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Finds a value referenced by a dot-chained property tree or sets its value
 * @param   {Object}    ref     Where to find the property
 * @param   {*}         prop    Dot-chained tree property
 * @param   {*}         value   New value to assign
 * @return  {*}         Current value of the property
 */
export const dotProp = (ref: object, prop: string, value?: any): undefined | any => {
    let result: undefined;
    if (prop.lastIndexOf('.') === -1) {
        result = ref[prop];
    } else {
        const splitProp: string[] = prop.split('.');
        const key = splitProp.shift();
        if (ref && typeof ref[key] === 'object') {
            result = dotProp(ref[key], splitProp.join('.'), value);
        }
    }

    if (value) {
        result = value;
        ref[prop] = value;
    }

    return result;
};
/* eslint-enable @typescript-eslint/no-explicit-any */
