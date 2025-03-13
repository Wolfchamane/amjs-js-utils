/* eslint @typescript-eslint/no-explicit-any: [0] */
import './styles.css';
import 'highlight.js/styles/default.css';
import {
    JSONAdapter,
    type XHR,
    type XHRFetchMethod,
    type XHRDebugLevel,
    XHR_DEBUG_LEVELS,
    XHR_FETCH_METHODS
} from '../../../src';
import hljs from 'highlight.js';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';

const hostname: string = 'swapi.dev/api';
let debug: XHRDebugLevel = XHR_DEBUG_LEVELS.DETAILS;

function setButtonDemo(selector: string, params?: Record<string, any>): void {
    const clickHandler = async (): Promise<void> => {
        const instance: XHR = new JSONAdapter({ hostname, debug });
        const secure: boolean = true;
        const path: string = '/people';
        const method: XHRFetchMethod = XHR_FETCH_METHODS.GET;
        const response = await instance.fetch(path, { method, secure, params });
        const resultNode: HTMLElement | null = document.querySelector(`${selector}-example .example-result`);
        if (resultNode) {
            const codeBlock = resultNode.querySelector('code');
            codeBlock.innerHTML = `// [${instance.request?.method}] ${instance.url?.href}\n\n${JSON.stringify(response, null, 4)}`;
            delete codeBlock.dataset.highlighted;
            hljs.highlightElement(codeBlock);
            resultNode.classList.remove('hide');
        }

        const toggleButton = resultNode && document.querySelector(`${selector}-toggle-results`);
        if (toggleButton) {
            toggleButton.removeAttribute('disabled');
            toggleButton.addEventListener('click', () => {
                resultNode.classList.toggle('hide');
            });
        }
    };

    document.querySelector(selector).addEventListener('click', clickHandler, false);
}

window.addEventListener('DOMContentLoaded', () => {
    setButtonDemo('#get-people');
    setButtonDemo('#query-params', { id: '1' });

    document.querySelector('#toggle-debug').addEventListener('change', (e: InputEvent) => {
        const { target } = e;
        const { checked } = target as HTMLInputElement;
        debug = checked ? XHR_DEBUG_LEVELS.DETAILS : XHR_DEBUG_LEVELS.QUIET;
    });

    hljs.registerLanguage('json', json);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('typescript', typescript);
    hljs.highlightAll();
});
