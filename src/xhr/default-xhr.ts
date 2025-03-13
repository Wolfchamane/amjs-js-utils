/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import {
    type XHR,
    type XHRFetchOptions,
    type XHRConfiguration,
    type XHRDebugLevel,
    type XHRFetchMethod,
    XHR_DEBUG_LEVELS,
    XHR_FETCH_METHODS
} from './types';

/**
 * Default class for any AJAX Http Requests
 */
export class DefaultXHR implements XHR {
    protected LOG_ERROR: string = 'error';
    protected LOG_WARNING: string = 'warn';
    protected LOG_INFO: string = 'log';
    protected LOG_GROUP: string = 'group';
    protected LOG_GROUP_END: string = 'groupEnd';
    protected LOG_DETAIL: string = 'info';
    protected LOG_TIME: string = 'time';
    protected LOG_TIME_END: string = 'timeEnd';

    /**
     * Level of detail for logs of this class
     * @property    debug
     * @type        XHRDebugLevel
     * @protected
     */
    protected debug: XHRDebugLevel;

    /**
     * To be requested
     * @property    hostname
     * @type        string
     * @protected
     */
    protected hostname: string;

    /**
     * To be fetched
     * @property    port
     * @type        {string|undefined}
     * @protected
     */
    protected port: undefined | string;

    /**
     * To control request
     * @property    controller
     * @type        {AbortController|undefined}
     * @private
     */
    private controller: AbortController | undefined;

    /**
     * To be performed
     * @property    request
     * @type        {Request|undefined}
     */
    request: Request | undefined;

    /**
     * Obtained from request
     * @property    response
     * @type        {Response|undefined}
     */
    response: Response | undefined;

    /**
     * Fetched
     * @property    url
     * @type        {URL|undefined}
     */
    url: URL | undefined;

    /**
     * @param {XHRConfiguration} config  Class configuration
     */
    constructor(config: XHRConfiguration) {
        const { hostname, port, debug } = config;
        this.hostname = hostname;
        this.port = port;
        this.debug = debug || XHR_DEBUG_LEVELS.QUIET;
    }

    /**
     * Returns whether log level meets class debug level or not
     * @param   {string}    level   Specific log level for a single message
     * @private
     * @return  {Boolean}   `true` if {level} meets class debug level
     */
    private _isTraceableLevel(level: string): boolean {
        const logLevelsToNumber: Record<string, number> = {
            [this.LOG_ERROR]: 0,
            [this.LOG_WARNING]: 1,
            [this.LOG_INFO]: 2,
            [this.LOG_GROUP]: 2,
            [this.LOG_GROUP_END]: 2,
            [this.LOG_DETAIL]: 3,
            [this.LOG_TIME]: 3,
            [this.LOG_TIME_END]: 3
        };

        const xhrDebugLevelToNumber: Record<string, number> = {
            [XHR_DEBUG_LEVELS.ERROR]: 0,
            [XHR_DEBUG_LEVELS.WARNING]: 1,
            [XHR_DEBUG_LEVELS.LOG]: 2,
            [XHR_DEBUG_LEVELS.DETAILS]: 3
        };

        return logLevelsToNumber[level] <= xhrDebugLevelToNumber[this.debug];
    }

    /**
     * Performs a `console.log`
     * @see   https://developer.mozilla.org/en/docs/Web/API/console
     * @param {string}              level   Specific level of a single log message
     * @param {undefined|boolean}   force   Whether log must be forced or not
     * @param {undefined|string}    message To be logged
     * @param {unknown[]}           args    Rest of arguments
     * @protected
     */
    protected _log(level: string, force?: boolean, message?: string, ...args: unknown[]) {
        if (force || (this.debug !== XHR_DEBUG_LEVELS.QUIET && this._isTraceableLevel(level))) {
            const log: string | undefined = [this.LOG_TIME, this.LOG_TIME_END].includes(level)
                ? message
                : `[${new Date().toISOString()}][${level}] ${message}`;
            // @ts-expect-error console method
            console[level](log, ...args);
        }
    }

    /**
     * Serializes a request.
     * @notice Must be override by adapter classes
     * @param {undefined|Record<string, string>}    headers Set of request headers
     * @param {undefined|any}                       body    To be sent as part of the request
     * @protected
     */
    protected _serialize(headers?: Record<string, string>, body?: any): Promise<void> {
        this._log(this.LOG_WARNING, true, '_serialize method must be override!');

        return Promise.resolve();
    }

    /**
     * des-Serializes a request.
     * @notice Must be override by adapter classes
     * @protected
     */
    protected _unSerialize(): Promise<any> {
        this._log(this.LOG_WARNING, true, '_unSerialize method must be override!');

        return Promise.resolve();
    }

    /**
     * Builds request {AbortController}
     * @private
     */
    private _buildController(): void {
        this.controller = new AbortController();
    }

    /**
     * Builds base URL to be fetched
     * @param   {string}            path    To be fetched
     * @param   {undefined|boolean} secure  Whether to use secure or not protocol
     * @return  {string}            Based URL formed with {protocol}://{hostname}{:port?}
     * @private
     */
    private _buildBaseURL(path: string, secure?: boolean): string {
        this._log(this.LOG_INFO, false, 'Building base URL');
        const protocol: string = secure ? 'https' : 'http';
        this._log(this.LOG_DETAIL, false, `Using ${protocol} protocol`);
        let url: string = [protocol, this.hostname, this.port ? `:${this.port}` : ''].filter(Boolean).join('://');

        if (path.startsWith('/')) {
            url += path;
        } else {
            url = [url, path].join('/');
        }

        this._log(this.LOG_DETAIL, false, `Base URL is "${url}"`);
        return url;
    }

    /**
     * Replaces parameters in URL path.
     * URL in-path parameters can be wrapped using brackets, i.e: `/path/{param}`.
     * Or they can be prefixed using semicolons, i.e.: `/path/:param`.
     *
     * @param   {string}                url     To evaluate
     * @param   {Record<string, any>}   params  To replace at URL.
     * @throws  {Error}                 If a parameter is not found within {params} record
     * @return  {string}                URL with all parameters in path replaced
     * @private
     */
    private _replacePathQueryParams(url: string, params: Record<string, any>): string {
        this._log(this.LOG_INFO, false, 'Replacing path query params');
        const paramInPathPattern: RegExp = /(([:{])\w+}?)/g;
        if (paramInPathPattern.test(url)) {
            url = url.replace(paramInPathPattern, (match: string) => {
                const key: string = match.replace(/\W/g, '');
                const value: any = params[key];

                if (value) {
                    delete params[key];
                    this._log(this.LOG_DETAIL, false, `Replacing URL in-path parameter "${key}" with "${value}"`);
                } else {
                    throw new Error(`Value for ${key} path param not found!`);
                }

                return value;
            });
        }

        return url;
    }

    /**
     * Adds additional query parameters to URL
     * @param   {string}                url     To be edited
     * @param   {Record<string, any>}   params  Remaining parameters to use as query parameters
     * @return  {string}                URL with query parameters
     * @private
     */
    private _addQueryParams(url: string, params: Record<string, any>): string {
        this._log(this.LOG_INFO, false, 'Adding additional query params');
        const keys: string[] = Object.keys(params);

        return keys.length ? [url, keys.map((key: string) => `${key}=${params[key]}`).join('&')].join('?') : url;
    }

    /**
     * Builds request URL to be fetched
     * @param   {string}                        path    To be fetched
     * @param   {undefined|Record<string, any>} params  To replace or add to end URL
     * @param   {undefined|boolean}             secure  Whether request is secure or not
     * @private
     */
    private _buildRequestURL(path: string, params?: Record<string, any>, secure?: boolean): void {
        this._log(this.LOG_INFO, false, 'Building request URL');
        let url = this._buildBaseURL(path, secure);

        if (params) {
            const paramsCopy = Object.assign({}, params);
            url = this._replacePathQueryParams(url, paramsCopy);
            url = this._addQueryParams(url, paramsCopy);
        }

        this.url = new URL(url);
        this._log(this.LOG_DETAIL, false, `URL set to: %o`, this.url);
    }

    /**
     * Builds the {Request} object to be used
     * @param   {XHRFetchMethod}    method  To perform
     * @private
     */
    private _buildRequest(method: XHRFetchMethod): void {
        this._log(this.LOG_INFO, false, 'Building request info object');
        if (this.url) {
            this.request = new Request(this.url, {
                method,
                signal: this.controller?.signal
            });
        }
        this._log(this.LOG_DETAIL, false, `Request info object set to: %o`, this.request);
    }

    /**
     * Performs an AJAX Http Request
     * @param   {string}          path    To be fetched
     * @param   {XHRFetchOptions} options Configures a single AJAX request
     */
    async fetch<T>(path: string, options?: XHRFetchOptions): Promise<T | any> {
        let result: T | any;
        try {
            const { secure, params, method, headers, body } = options || {};
            this._log(this.LOG_GROUP, false, `Request to "${path}"`);
            this._buildController();
            this._buildRequestURL(path, params, secure);
            this._buildRequest(method || XHR_FETCH_METHODS.GET);
            await this._serialize(headers, body);
            if (this.request) {
                this._log(this.LOG_DETAIL, false, 'Request start!');
                this._log(this.LOG_TIME, false, 'Duration');
                this.response = await fetch(this.request);
                this._log(this.LOG_TIME_END, false, 'Duration');
                this._log(this.LOG_DETAIL, false, 'Request end!');
            }
            result = await this._unSerialize();
        } catch (e: unknown) {
            this._log(this.LOG_ERROR, false, (e as Error).message);
            result = e;
        } finally {
            this._log(this.LOG_DETAIL, false, `Result: %o`, result);
            this._log(this.LOG_GROUP_END);
        }

        return result;
    }

    /**
     * Aborts current request
     * @param {undefined|string}    reason To abort request
     */
    abort(reason?: string) {
        if (this.controller) {
            this._log(this.LOG_INFO, false, `Aborting request to ${this.url?.href}`);
            this.controller.abort(reason);
        }
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
