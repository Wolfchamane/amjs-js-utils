/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultXHR } from '../default-xhr';
import { XHR_FETCH_METHODS, type XHRFetchMethod } from '../types';

/**
 * Adaptor for any `'application/json'` AJAX Http Request.
 * @see https://github.com/Wolfchamane/amjs-js-utils/blob/master/examples/xhr/main.ts
 */
export class JSONAdapter extends DefaultXHR {
    /**
     * @override
     */
    protected _serialize(headers?: Record<string, string>, body?: any): Promise<void | Error> {
        return new Promise((resolve, reject) => {
            this._log(this.LOG_INFO, false, `Serializing request for JSON`);
            if (this.request && this.url) {
                const jsonHeaders: Record<string, string> = Object.assign({}, headers || {}, {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                });

                Object.keys(jsonHeaders).forEach((key: string) => {
                    this.request?.headers.set(key, jsonHeaders[key]);
                });

                if (
                    [XHR_FETCH_METHODS.PATCH, XHR_FETCH_METHODS.PUT, XHR_FETCH_METHODS.POST].includes(
                        this.request?.method as XHRFetchMethod
                    )
                ) {
                    if (body) {
                        this.request = new Request(this.url, {
                            method: this.request?.method,
                            headers: this.request?.headers,
                            body: JSON.stringify(body)
                        });
                    } else {
                        reject(new Error('Cannot serialize empty body request'));
                    }
                }

                this._log(this.LOG_DETAIL, false, `Override request to: %o`, this.request);
                resolve();
            } else {
                reject('Cannot serialized undefined request');
            }
        });
    }

    /**
     * @override
     * @protected
     */
    protected async _unSerialize<T>(): Promise<T | Error> {
        this._log(this.LOG_INFO, false, `unSerializing request for JSON`);
        if (this.response && this.response.ok) {
            return (await this.response.json()) as T;
        } else {
            throw new Error('Cannot unSerialize empty or failed response');
        }
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
