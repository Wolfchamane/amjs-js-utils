/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSONAdapter, XHR_DEBUG_LEVELS, type XHR, XHRFetchMethod, XHR_FETCH_METHODS } from '@/xhr';
import { describe, test, expect, beforeEach } from '@jest/globals';

describe('JSONAdapter', () => {
    const secure: boolean = true;
    const hostname: string = 'swapi.dev/api';
    let sut: XHR;
    let response: any | Error | undefined;

    beforeEach(() => {
        response = undefined;

        sut = new JSONAdapter({
            hostname,
            debug: XHR_DEBUG_LEVELS.DETAILS
        });
    });

    test('Completes a GET request', async () => {
        interface ExpectedResult {
            count: number;
            next: string;
            previous: string | null;
            results: Record<string, any>[];
        }

        const path: string = '/people';
        const method: XHRFetchMethod = XHR_FETCH_METHODS.GET;
        response = await sut.fetch<ExpectedResult>(path, { method, secure });
        expect(response).not.toBeUndefined();
        expect(response).not.toBeNull();
        expect(response).not.toBeInstanceOf(Error);
        expect(response).toBeInstanceOf(Object);
        expect(response.count).not.toBe(0);
        expect(response.next).not.toBe('');
        expect(response.previous).toBeNull();
        expect(Array.isArray(response?.results)).toBeTruthy();
    });

    test('Fills a path param', async () => {
        const path: string = '/people/:id';
        const method: XHRFetchMethod = XHR_FETCH_METHODS.GET;
        const params: Record<string, any> = { id: 1 };
        response = await sut.fetch<Record<string, any>>(path, { method, params, secure });
        expect(response).not.toBeUndefined();
        expect(response).not.toBeNull();
        expect(response).not.toBeInstanceOf(Error);
        expect(response).toBeInstanceOf(Object);
    });
});
/* eslint-enable @typescript-eslint/no-explicit-any */
