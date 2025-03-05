import { stringify } from './stringify.ts';

/**
 * Transforms a text into itself but with first character in upper case, i.e: 'hello' -> 'Hello'
 * @param   {String}    text    To be transformed
 * @return  {String}    Capitalized text
 * @throws  An error if {text} is not valid
 */
export function capitalize(text: string): string {
    text = stringify(text);

    return `${text.charAt(0).toUpperCase()}${text.substring(1)}`;
}
