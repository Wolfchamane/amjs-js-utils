/**
 * Creates an UUID v4 "unique" string.
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
 * @return  {String}    "unique" string
 */
export const uuid = (): string => {
    let seed = Date.now();
    try {
        if (window && window.performance && window.performance.now instanceof Function) {
            seed += window.performance.now();
        }
    } catch (e: unknown) {
        console.error(`[@amjs/js-utils][ERROR] %o`, e);
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (seed + Math.random() * 16) % 16 | 0;
        seed = Math.floor(seed / 16);

        return (c === 'x' ? r : r & (0x3 | 0x8)).toString(16);
    });
};
