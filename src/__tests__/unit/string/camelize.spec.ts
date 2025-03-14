import { camelize } from '@/string';
import { describe, test, expect } from '@jest/globals';

describe('camelize', () => {
    test('Converts an string into its camel-case version', () => {
        expect(camelize('hello world')).toEqual('helloWorld');
    });
});
