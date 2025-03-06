import { stringify } from './stringify';

/**
 * Transforms a text into itself but with first character in upper case, i.e.:
 * ```typescript
 * import { capitalize } form '@amjs/js-utils';
 * console.log(capitalize('hello')); // "Hello"
 * ```
 *
 * @param   {String}    text    To be transformed
 * @return  {String}    Capitalized text
 * @throws  {Error}     If {text} is not valid
 */
export function capitalize(text: string): string {
    text = stringify(text);

    return `${text.charAt(0).toUpperCase()}${text.substring(1)}`;
}
