/* eslint-disable @typescript-eslint/no-explicit-any */
import fetchMock from 'jest-fetch-mock';
import { JSONAdapter, type XHR, XHR_FETCH_METHODS } from '@/xhr';
import { describe, test, expect, beforeEach, beforeAll, afterAll } from '@jest/globals';

beforeAll(() => fetchMock.enableMocks());
afterAll(() => fetchMock.disableMocks());

describe('JSONAdapter', () => {
    const hostname: string = 'example';
    const port: string = '3000';
    const responseOk = { status: 'ok' };

    let sut: XHR;
    beforeEach(() => {
        fetchMock.resetMocks();
        sut = new JSONAdapter({ hostname, port });
    });

    test('"application/json" headers are set into request', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(responseOk));
        await sut.fetch('/path');
        expect(sut.request).not.toBeUndefined();
        expect(sut.request?.headers.get('Accept')).toEqual('application/json');
        expect(sut.request?.headers.get('Content-Type')).toEqual('application/json');
    });

    test('An error is returned if POST/PUT/PATCH request do not have a body', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(responseOk));
        const response = await sut.fetch('/path', {
            method: XHR_FETCH_METHODS.POST
        });
        expect(response).toBeInstanceOf(Error);
    });
});
/* eslint-enable @typescript-eslint/no-explicit-any */
