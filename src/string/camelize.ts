import { capitalize } from './capitalize';
import { stringify } from './stringify';

/**
 * Transforms a text into its camel-case form, i.e.:
 * ```typescript
 * import { camelize } form '@amjs/js-utils';
 * console.log(camelize('hello-world')); // "helloWorld"
 * ```
 *
 * @param   {String}    text    To be transformed
 * @return  {String}    camel-case form
 * @throws  {Error}     If {text} is not a valid string
 */
export function camelize(text: string): string {
    text = stringify(text);

    return text
        .split(/[\W\s]+/g)
        .filter(Boolean)
        .map((p, i) => (i ? capitalize(p) : p))
        .join('');
}
