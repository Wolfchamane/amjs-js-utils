export function stringify(value: any): string {
    if (value === null || value === undefined) {
        throw new Error('@amjs/utils > stringify > cannot convert to string null or undefined value');
    } else if (typeof value === 'object') {
        value = JSON.stringify(value);
    } else {
        value = value.toString();
    }

    return value;
}
