/**
 * Simple help function to instanciate an array.
 *
 * Because I don't want to write this all the time:
 * const array: X[] = [];
 *
 * @return The created array.
 *
 * @example
 * arr<number>();
 * // => number[]
 */
export function arr<T>(): T[] {
    return [] as T[];
}

/**
 * Flatten an array.
 *
 * @param array The array to flat.
 *
 * @return The flatten array.
 *
 * @example
 * arr_flat([ [1, 2], [3, 4] ]);
 * // => [1, 2, 3, 4]
 */
export function arr_flat<T>(array: T[][]): T[] {
    return array.flat();
}

/**
 * Delete an item from an array.
 *
 * @param array The given array where the item should be deleted.
 * @param item The index of the item.
 *
 * @return The array without the unwanted element.
 *
 * @example
 * arr_delete([ 1, 2 ], 0);
 * // => [ 2 ]
 */
export function arr_delete<T>(
    array: T[],
    item: number
): T[] {
    if (item === 0) return array.slice(1);
    else if ((item + 1) >= array.length) throw new Error("array index out of bounds");
    else if ((item + 1) === array.length) return array.slice(0, -1);
    else return [...array.slice(0, item), ...array.slice(item + 1)];
}

/**
 * Get one random element from an array.
 *
 * @param array The array you want to get the element from.
 *
 * @return The random element.
 */
export function arr_rand<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get x random elements from an array.
 *
 * @param array The array you want to get the elements from.
 * @param count The amount of elements you want to get.
 *
 * @return An array with the random elements.
 */
export function arr_rands<T>(array: T[], count: number): T[] {
    const rindex = function <T>(arr: T[]) {
        return Math.floor(Math.random() * arr.length);
    };

    let new_array = array;
    const result = arr<T>();

    for (let i = 0; i <= count; i++) {
        const item_idx = rindex(new_array);
        const item = new_array[item_idx];
        new_array = arr_delete(new_array, item_idx);
        result.push(item);
    }

    return result;
}
