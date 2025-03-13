/* eslint-disable @typescript-eslint/no-explicit-any */
export type XHRDebugLevel = 'quiet' | 'error' | 'warning' | 'log' | 'details';
export const XHR_DEBUG_LEVELS = {
    QUIET: 'quiet' as XHRDebugLevel,
    ERROR: 'error' as XHRDebugLevel,
    WARNING: 'warning' as XHRDebugLevel,
    LOG: 'log' as XHRDebugLevel,
    DETAILS: 'details' as XHRDebugLevel
};

export type XHRFetchMethod = 'OPTIONS' | 'HEAD' | 'GET' | 'PATCH' | 'PUT' | 'POST' | 'DELETE' | 'CONNECT' | 'TRACE';
export const XHR_FETCH_METHODS = {
    OPTIONS: 'OPTIONS' as XHRFetchMethod,
    HEAD: 'HEAD' as XHRFetchMethod,
    GET: 'GET' as XHRFetchMethod,
    PATCH: 'PATCH' as XHRFetchMethod,
    PUT: 'PUT' as XHRFetchMethod,
    POST: 'POST' as XHRFetchMethod,
    DELETE: 'DELETE' as XHRFetchMethod,
    CONNECT: 'CONNECT' as XHRFetchMethod,
    TRACE: 'TRACE' as XHRFetchMethod
};

export interface XHRFetchOptions {
    method?: XHRFetchMethod;
    secure?: boolean;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
}

export interface XHR {
    request: Request | undefined;
    response: Response | undefined;
    url: URL | undefined;
    fetch<T>(path: string, options?: XHRFetchOptions): Promise<T | any>;
    abort(reason?: string): void;
}

export interface XHRConfiguration {
    hostname: string;
    port?: string;
    debug?: XHRDebugLevel;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
