/**
 * Create an object with default options and pass the other object on it.
 *
 * @example
 * obj_default({ a: 2, b: 1 }, { a: 1, c: 3 });
 * // => { a: 2, b: 1, c: 3 }
 */
export function obj_default<A, B>(object: A, defaultObject: B): A & B {
    return {
        ...defaultObject,
        ...object,
    };
}
