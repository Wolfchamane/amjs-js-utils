import { capitalize } from './capitalize';
import { stringify } from './stringify';

/**
 * Transforms a text into its camel-case form, i.e.: 'hello-world' -> 'helloWorld'
 * @param   {String}    text    To be transformed
 * @return  {String}    camel-case form
 */
export function camelize(text: string): string {
    text = stringify(text);

    return text
        .split(/[\W\s]+/g)
        .filter(Boolean)
        .map((p, i) => (i ? capitalize(p) : p))
        .join('');
}
