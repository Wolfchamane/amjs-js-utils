import { dotProp } from '@/object';
import { describe, test, expect } from '@jest/globals';

describe('dotProp', () => {
    const objectRef = {
        key: { param: 'one' },
        other: { param: 'two' }
    };

    test('dotProp(objectRef, \'key.param\') should return "one"', () =>
        expect(dotProp(objectRef, 'key.param')).toEqual(objectRef.key.param));

    test("dotProp(objectRef, 'other.param', 'three') should return \"three\" and modify object", () => {
        expect(dotProp(objectRef, 'other.param', 'three')).toEqual('three');
        expect(objectRef.other.param).toEqual('three');
    });
});
