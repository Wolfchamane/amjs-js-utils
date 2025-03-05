import { dotProp } from './dot-prop.ts';
import { describe, test, expect } from '@jest/globals';

describe('dotProp', () => {
    const objectRef = {
        key: { param: 'one' },
        other: { param: 'two' }
    };

    test('dotProp({ ref, prop: "key.param"}) should return "one"', () =>
        expect(dotProp({ ref: objectRef, prop: 'key.param' })).toEqual(objectRef.key.param));

    test('dotProp({ ref, prop: "other.param", value: "three" }) should return "three" and modify object', () => {
        expect(dotProp({ ref: objectRef, prop: 'other.param', value: 'three' })).toEqual('three');
        expect(objectRef.other.param).toEqual('three');
    });
});
