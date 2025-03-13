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
    private readonly registry: Record<string, <T>(value?: any) => T>;

    private $i: FactoryInstance | undefined;

    /**
     * Returns a singleton instance
     * @return {FactoryInstance}    Singleton
     */
    static i(): FactoryInstance {
        Factory.prototype.$i = Factory.prototype.$i || new Factory();

        return Factory.prototype.$i;
    }

    constructor() {
        this.registry = {};
    }

    /**
     * Returns whether class constructor is being registered at the factory singleton.
     * @param   {string}    name    Class constructor identifier within factory registry
     * @return  {boolean}   `true` if exists, `false` in other case
     */
    has(name: string): boolean {
        return this.registry && name in this.registry;
    }

    /**
     * Registers a class constructor identified by the {name} parameter
     * @param   {string}    name        Class constructor unique identifier
     * @param   {Function}  Constructor To be registered
     */
    register(name: string, Constructor: <T>(value?: any) => T): void {
        if (!this.has(name)) {
            this.registry[name] = Constructor;
        }
    }

    /**
     * Removes an existing class constructor
     * @param   {string}    name    Identifier to be removed
     */
    remove(name: string): void {
        if (this.has(name)) {
            delete this.registry[name];
        }
    }

    /**
     * List all registered class constructors
     */
    list(): string[] {
        return Object.keys(this.registry);
    }

    /**
     * Creates a singleton of a registered class constructor
     * @param   {string}        name    Identifier of the class constructor within the registry
     * @param   {undefined|*}   value   To pass as argument for the class constructor
     * @return  {undefined|*}   Singleton of the class, or `undefined` in other case
     */
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
