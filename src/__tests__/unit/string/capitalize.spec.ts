import { capitalize } from '@/string';
import { describe, test, expect } from '@jest/globals';

describe('capitalize', () => {
    test('Transforms a valid string first character into its capital', () => {
        expect(capitalize('hello')[0]).toEqual('H');
    });
});
