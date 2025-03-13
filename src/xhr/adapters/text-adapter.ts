/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultXHR } from '../default-xhr';
import { XHR_FETCH_METHODS, type XHRFetchMethod } from '../types';

/**
 * Adaptor for any `'text/plain'` AJAX Http Request.
 * @see https://github.com/Wolfchamane/amjs-js-utils/examples/xhr/main.ts
 */
export class TextAdapter extends DefaultXHR {
    /**
     * @override
     * @param   {undefined|Record<string, string>}  headers Set of headers for the request.
     * @param   {undefined|any}                     body    To sent as part of 'PUT', 'POST' or 'PATCH' requests.
     * @protected
     * @return  {Promise<void>}                     `resolved` after override Request, `reject<Error>` in other case
     */
    protected _serialize(headers?: Record<string, string>, body?: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._log(this.LOG_INFO, false, `Serializing request for text`);
            if (this.request && this.url) {
                const textHeaders: Record<string, string> = Object.assign({}, headers || {}, {
                    Accept: 'text/plain',
                    'Content-Type': 'text/plain'
                });

                Object.keys(textHeaders).forEach((key: string) => {
                    this.request?.headers.set(key, textHeaders[key]);
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

                this._log(this.LOG_DETAIL, false, `Request override to: %o`, this.request);
                resolve();
            } else {
                reject(new Error('Cannot serialized undefined request'));
            }
        });
    }

    /**
     * @override
     * @protected
     * @return      {Promise<string>}   Resolve text from response
     * @throws      {Error}             If cannot resolve text from response
     */
    protected async _unSerialize(): Promise<string> {
        this._log(this.LOG_INFO, false, `unSerializing request for text/plain`);
        if (this.response && this.response.ok) {
            return await this.response.text();
        } else {
            throw new Error('Cannot unSerialize empty or failed response');
        }
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
