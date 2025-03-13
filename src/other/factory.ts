/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FactoryInstance {
    has(name: string): boolean;
    register(name: string, Constructor: <T>(value?: any) => T): void;
    remove(name: string): void;
    list(): string[];
    create<T>(name: string, value?: any): T | undefined;
}

/**
 * Allows to manage singleton instances of any class-oriented development.
 *
 * ```typescript
 * import { Factory, type FactoryInstance } from '@amjs/js-utils';
 *
 * class MyClass {
 *      config: any;
 *
 *      constructor(config: any) {
 *          this.config = config;
 *      }
 * }
 *
 * const fi: FactoryInstance = Factory.i();
 * fi.register('my-class', MyClass);
 * console.log(fi.has('my-class')); // true
 * console.log(fi.list()); // ['my-class']
 *
 * const mCi = fi.create('my-class', 'some-value');
 * console.log(mCi.config); // 'some-value'
 * ```
 */
export class Factory implements FactoryInstance {
    readonly registry: Record<string, <T>(value?: any) => T>;

    private $i: FactoryInstance | undefined;

    static i(): FactoryInstance {
        Factory.prototype.$i = Factory.prototype.$i || new Factory();

        return Factory.prototype.$i;
    }

    constructor() {
        this.registry = {};
    }

    has(name: string): boolean {
        return this.registry && name in this.registry;
    }

    register(name: string, Constructor: <T>(value?: any) => T): void {
        if (!this.has(name)) {
            this.registry[name] = Constructor;
        }
    }

    remove(name: string): void {
        if (this.has(name)) {
            delete this.registry[name];
        }
    }

    list(): string[] {
        return Object.keys(this.registry);
    }

    create<T>(name: string, value?: any): T | any {
        const Constructor: boolean | (<T>(value?: any) => T) = this.has(name) && this.registry[name];
        if (Constructor instanceof Function) {
            // @ts-expect-error lack
            return new Constructor(value);
        }

        return undefined;
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
