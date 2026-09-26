import { type XHR, type XHRConfiguration, XHR_FETCH_METHODS, XHR_DEBUG_LEVELS } from './types';
import { DefaultXHR } from './default-xhr';
import { afterEach, describe, test, expect, beforeEach, vi } from 'vitest';

describe('DefaultXHR', () => {
    const hostname: string = 'example';
    const port: string = '3000';

    class MockAdapter extends DefaultXHR {
        constructor(config: XHRConfiguration) {
            super({ ...config, debug: XHR_DEBUG_LEVELS.DETAILS });
        }
    }

    let sut: XHR;
    beforeEach(() => {
        sut = new MockAdapter({ hostname, port });
    });

    afterEach(() => {
        sut.reset();
    });

    test('Request is configured as expected', async () => {
        await sut.fetch('path');
        const config = sut.getPathRequest('path');
        expect(config.request).not.toBeUndefined();
        expect(config.request?.method).toEqual(XHR_FETCH_METHODS.GET);
        expect(config.url).not.toBeUndefined();
        expect(config.url?.href).toEqual(`http://${hostname}:${port}/path`);
    });

    test('Secured request are configured as expected', async () => {
        sut = new MockAdapter({ hostname, port, secure: true });
        await sut.fetch('/path');
        const config = sut.getPathRequest('/path');
        expect(config.url).not.toBeUndefined();
        expect(config.url?.href).toContain('https');
    });

    test('Params are added/replaced', async () => {
        await sut.fetch('/path/{id}', {
            params: { id: '1', key: 'value' }
        });
        const config = sut.getPathRequest('/path/{id}');
        expect(config.url).not.toBeUndefined();
        expect(config.url?.href).toEqual(`http://${hostname}:${port}/path/1?key=value`);
    });

    test('No params in path are replaced', async () => {
        await sut.fetch('/path', {
            params: { id: '1', key: 'value' }
        });
        const config = sut.getPathRequest('/path');
        expect(config.url).not.toBeUndefined();
        expect(config.url?.href).toEqual(`http://${hostname}:${port}/path?id=1&key=value`);
    });

    test('Any error is captured and returned', async () => {
        const response = await sut.fetch('/path/{id}', {
            params: { foo: 'value' }
        });
        expect(response).toBeInstanceOf(Error);
    });

    test('Any request can be aborted', () => {
        const abortMock = vi.fn();
        class MockController {
            abort(args: any) {
                abortMock(args);
            }
        }

        vi.stubGlobal('AbortController', MockController);

        sut.fetch('/path').then(() => {
            expect(abortMock).toHaveBeenCalledWith('reason');
        });

        sut.abort('/path', 'reason');
    });
});
