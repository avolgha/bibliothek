import { num_between_inc } from "./number";

/**
 * Configuration options for a BoundNumber
 */
export interface BoundNumberConfig {
    /**
     * The bound rules of the number.
     *
     * Declaration:
     * [ <highest possible>, <lowest possible> ]
     *
     * @example
     * [4, 1]
     * // => num > 1 && num < 4
     */
    bound: [number, number];

    /**
     * The default value on creation.
     *
     * Default to `0`.
     */
    value?: number;

    /**
     * Whether there should be an exception when the set number does not satisfy the requirements.
     *
     * Default to `false`.
     */
    throwOnFalseValue?: boolean;
}

/**
 * A bound number.
 *
 * A bound number is a number that stays between two other numbers.
 *
 * The easiest way to create one is by using the `num_bound(...)` method
 * of this library.
 */
export class BoundNumber {
    private bound: [number, number];
    #value: number;
    private throwOnFalseValue: boolean;

    constructor(config: BoundNumberConfig) {
        this.bound = config.bound;

        const [upper, lower] = this.bound;
        if (lower > upper) {
            throw `Highest possible (${upper}) is lower than the lowest possible (${lower}).`;
        }

        this.#value = config.value || 0;
        this.throwOnFalseValue = config.throwOnFalseValue || false;
    }

    get value() {
        return this.#value;
    }

    set value(next: number) {
        const [upper, lower] = this.bound;

        if (num_between_inc(next, upper, lower)) {
            this.#value = next;
            return;
        }

        if (this.throwOnFalseValue) {
            throw `Given Number (${next}) does not satisfy the requirements: <${upper} and >${lower}.`;
        }
    }

    /**
     * Performs a more complex action on the number.
     *
     * @example
     * boundNumber.action((num) => num / (num + 1));
     * // => x / (x + 1)
     */
    action(fn: (input: number) => number) {
        this.value = fn(this.value);
    }

    /**
     * Increment the number.
     *
     * @example
     * boundNumber.inc();
     * // => x++;
     */
    inc() {
        this.value += 1;
    }

    /**
     * Decrement the number.
     *
     * @example
     * boundNumber.dec();
     * // => x--
     */
    dec() {
        this.value -= 1;
    }

    /**
     * Perform the "plus" operation on the number.
     *
     * @example
     * boundNumber.plus(5);
     * // => x + 5
     */
    plus(factor: number) {
        this.value += factor;
    }

    /**
     * Perform the "minus" operation on the number.
     *
     * @example
     * boundNumber.minus(5);
     * // => x - 5
     */
    minus(factor: number) {
        this.value -= factor;
    }

    /**
     * Perform the "multiply" operation on the number.
     *
     * @example
     * boundNumber.multiply(5);
     * // => x * 5
     */
    multiply(factor: number) {
        this.value *= factor;
    }

    /**
     * Perform the "divide" operation on the number.
     *
     * @example
     * boundNumber.divide(5);
     * // => x / 5
     */
    divide(factor: number) {
        this.value /= factor;
    }

    /**
     * Perform the "modulo" operation on the number.
     *
     * @example
     * boundNumber.modulo(5);
     * // => x % 5
     */
    modulo(factor: number) {
        this.value %= factor;
    }

    /**
     * Perform the "exponent" operation on the number;
     *
     * @example
     * boundNumber.exponent(5);
     * // => x ^ 5
     */
    exponent(factor: number) {
        this.value = Math.pow(this.value, factor);
    }

    /**
     * Set the number to another number without mathematical operations.
     */
    assign(newValue: number) {
        this.value = newValue;
    }

    /**
     * Transforms the number to a string.
     *
     * @param digits The number of digits after the comma.
     */
    str(digits = 0): string {
        return digits <= 0 ? "" + this.value : this.value.toFixed(digits);
    }
}
