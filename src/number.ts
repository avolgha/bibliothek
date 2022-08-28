import { BoundNumber } from "./boundNumber.js";

/**
 * Get all numbers in a range of numbers.
 *
 * @param from The lowest bound.
 * @param to The highest bound.
 *
 * @return An array with the generated numbers.
 *
 * @example
 * num_range(1, 3);
 * // => [ 1, 2 ]
 *
 * @example
 * num_range(5, 10)
 * // => [ 5, 6, 7, 8, 9 ]
 */
export function num_range(from: number, to: number): number[] {
    const array: number[] = [];
    for (let n = from; n < to; n++) array.push(n);
    return array;
}

/**
 * Get all numbers in a range of numbers in an iterator.
 *
 * @param from The lowest bound.
 * @param to The highest bound.
 *
 * @example
 * const iter = num_range_iter(1, 3);
 * iter.next(); // => { value: 1, done: false }
 * iter.next(); // => { value: 2, done: false }
 * iter.next(); // => { done: true }
 */
export function* num_range_iter(from: number, to: number) {
    for (let n = from; n < to; n++) yield n;
}

/**
 * Create a bound number.
 *
 * @param initial The initial value. Should not be undefined but if it isn't, the default is `0`.
 * @param from The lowest possible value.
 * @param to The highest possible value.
 *
 * @return The created BoundNumber.
 *
 * @example
 * const bound = num_bound(5, 4, 7);
 * bound.value;
 * // => 5
 * bound.inc();
 * bound.value;
 * // => 6
 */
export function num_bound(
    initial: number | undefined,
    from: number,
    to: number
): BoundNumber {
    return new BoundNumber({
        value: initial,
        // the format we use to specify the bounds is a bit weird.
        // we require the dev to first put the upper bound and then the lower bound.
        bound: [to, from],
    });
}

/**
 * Check if a given number (x) is between two other numbers (y, z).
 * => y > x > z
 *
 * To check if a given number is between two other numbers or if it is one of these, use `num_between_inc`.
 *
 * @param num The number to check on.
 * @param upper The upper bound of the range.
 * @param lower The lower bound of the range.
 *
 * @example
 * num_between(2, 1, 3);
 * // => true
 *
 * @example
 * num_between(2, 0, 1);
 * // => false
 */
export function num_between(
    num: number,
    upper: number,
    lower: number
): boolean {
    return upper > num && num > lower;
}

/**
 * Check if a number is between two other numbers or if it is one of these.
 *
 * To check if a number is only between two numbers, use `num_between`.
 *
 * @param num The number to check on.
 * @param upper The upper bound of the range.
 * @param lower The lower bound of the range.
 *
 * @example
 * num_between_inc(2, 1, 3);
 * // => true
 *
 * @example
 * num_between_inc(1, 1, 3);
 * // => true
 */
export function num_between_inc(
    num: number,
    upper: number,
    lower: number
): boolean {
    return num_between(num, upper, lower) || num === upper || num === lower;
}

/**
 * Generate a random number between two other numbers.
 *
 * @param max The maximal possible value.
 * @param min The minimal possible value. (Default: 0)
 *
 * @return The random number.
 *
 * @example
 * num_rand(5, 0);
 * // => 0 <= x <= 5
 */
export function num_rand(max: number, min: number = 0): number {
    return Math.random() * (max - min) + min;
}
