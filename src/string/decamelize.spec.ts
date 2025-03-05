import { decamelize } from './decamelize.ts';
import { describe, test, expect } from '@jest/globals';

describe('decamelize', () => {
    test('Transforms a camelCase text into a word-separated text', () => {
        expect(decamelize('helloWorld', '-')).toEqual('hello-World');
    });
});
