import { flatten } from "./internal/flat";

/**
 * Create an object with default options and pass the other object on it.
 *
 * @example
 * obj_default({ a: 2, b: 1 }, { a: 1, c: 3 });
 * // => { a: 2, b: 1, c: 3 }
 */
export function obj_default<A, B = A>(object: A, defaultObject: B): A & B {
    return {
        ...defaultObject,
        ...object,
    };
}

/**
 * Flat an object.
 *
 * @param object The object you want to flat.
 * @returns The flatten object.
 *
 * @example
 * obj_flat({ x: { y: 2 }, z: 4 });
 * // => { "x.y": 2, z: 4 }
 */
export function obj_flat(object: unknown): {
    [key: string]: unknown;
} {
    return flatten(object);
}

/**
 * Get a key from an object.
 *
 * @param object The object you want to get the value from.
 * @param key The key of the value.
 * @returns The value you get through the key and the object.
 *
 * @example
 * obj_key({ x: { y: 2 }, z: 4 }, "x.y");
 * // => 2
 */
export function obj_key(object: unknown, key: string): unknown {
    return obj_flat(object)[key];
}
