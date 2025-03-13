/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultXHR } from '../default-xhr';
import { XHR_FETCH_METHODS, type XHRFetchMethod } from '../types';

/**
 * Adaptor for any `'application/json'` AJAX Http Request.
 * @see https://github.com/Wolfchamane/amjs-js-utils/examples/xhr/main.ts
 */
export class JSONAdapter extends DefaultXHR {
    /**
     * @override
     * @param   {undefined|Record<string, string>}  headers Set of headers for the request.
     * @param   {undefined|any}                     body    To sent as part of 'PUT', 'POST' or 'PATCH' requests.
     * @protected
     * @return  {Promise<void>}                     `resolved` after override Request, `reject<Error>` in other case
     */
    protected _serialize(headers?: Record<string, string>, body?: any): Promise<void> {
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
                    body &&
                    [XHR_FETCH_METHODS.PATCH, XHR_FETCH_METHODS.PUT, XHR_FETCH_METHODS.POST].includes(
                        this.request?.method as XHRFetchMethod
                    )
                ) {
                    this.request = new Request(this.url, {
                        method: this.request?.method,
                        headers: this.request?.headers,
                        body: JSON.stringify(body)
                    });
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
     * @return      {Promise<string>}   Resolve object from response
     * @throws      {Error}             If cannot resolve object from response
     */
    protected async _unSerialize(): Promise<object> {
        this._log(this.LOG_INFO, false, `unSerializing request for JSON`);
        if (this.response && this.response.ok) {
            return await this.response.json();
        } else {
            throw new Error('Cannot unSerialize empty or failed response');
        }
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
