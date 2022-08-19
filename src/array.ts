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

// TODO: array#arr_delete : replace function with array.slice.
/**
 * Delete an item from an array.
 *
 * **Warning**: the forceFullRemove parameter exists, because you might want to have some values that are null or undefined in the array. 
 * JavaScript limits us by only giving the delete-keyword. But this does not delete a value but rather replaces it with null. So we have
 * this parameter if you want to have this null in your array. 
 *
 * @param array The given array where the item should be deleted.
 * @param item The index of the item.
 * @param forceFullRemove Determine whether the array should be checked for non-null afterwards. (Default: true)
 *
 * @return The array without the unwanted element.
 *
 * @example
 * arr_delete([ 1, 2 ], 1);
 * // => [ 2 ]
 *
 * @example
 * arr_delete([ 1, 2 ], 1, false);
 * // => [ null, 2 ]
 */
export function arr_delete<T>(array: T[], item: number, forceFullRemove = true): T[] {
	delete array[item];
	return !forceFullRemove ? array : array.filter((current) => current !== null && current !== undefined);
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
