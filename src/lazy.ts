export type LazyValue<T> = {
    store: T | undefined;
    get(): T;
};

/**
 * Create a LazyValue that contains a function that can be used to get the value
 * or to evaluate the lazy value.
 *
 * @param evaluate The function you want to get the value from.
 * @returns A LazyValue object you can use to retrieve the value.
 *
 * @example
 * const value = lazy(() => 5);
 * value.get();
 * // => 5
 */
export function lazy<T>(evaluate: () => T): LazyValue<T> {
    return {
        store: undefined,
        get() {
            if (!this.store) {
                this.store = evaluate();
            }

            return this.store;
        },
    };
}
