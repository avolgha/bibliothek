import * as os from 'node:os';

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
declare function arr<T>(): T[];
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
declare function arr_flat<T>(array: T[][]): T[];
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
declare function arr_delete<T>(array: T[], item: number, forceFullRemove?: boolean): T[];
/**
 * Get one random element from an array.
 *
 * @param array The array you want to get the element from.
 *
 * @return The random element.
 */
declare function arr_rand<T>(array: T[]): T;
/**
 * Get x random elements from an array.
 *
 * @param array The array you want to get the elements from.
 * @param count The amount of elements you want to get.
 *
 * @return An array with the random elements.
 */
declare function arr_rands<T>(array: T[], count: number): T[];

declare function assert(statement: boolean, message: string): void;
declare function assert_equals<T>(first: T, second: T, message: string): void;
declare function assert_between(value: number, max: number, min: number, message: string): void;
declare function assert_number(value: any, message: string): number;
declare function assert_matches<T>(value: T, matches: {
    message: string;
    function: (input: T) => boolean;
}[]): void;

/**
 * Configuration options for a BoundNumber
 */
interface BoundNumberConfig {
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
declare class BoundNumber {
    #private;
    private bound;
    private throwOnFalseValue;
    constructor(config: BoundNumberConfig);
    get value(): number;
    set value(next: number);
    /**
     * Performs a more complex action on the number.
     *
     * @example
     * boundNumber.action((num) => num / (num + 1));
     * // => x / (x + 1)
     */
    action(fn: (input: number) => number): void;
    /**
     * Increment the number.
     *
     * @example
     * boundNumber.inc();
     * // => x++;
     */
    inc(): void;
    /**
     * Decrement the number.
     *
     * @example
     * boundNumber.dec();
     * // => x--
     */
    dec(): void;
    /**
     * Perform the "plus" operation on the number.
     *
     * @example
     * boundNumber.plus(5);
     * // => x + 5
     */
    plus(factor: number): void;
    /**
     * Perform the "minus" operation on the number.
     *
     * @example
     * boundNumber.minus(5);
     * // => x - 5
     */
    minus(factor: number): void;
    /**
     * Perform the "multiply" operation on the number.
     *
     * @example
     * boundNumber.multiply(5);
     * // => x * 5
     */
    multiply(factor: number): void;
    /**
     * Perform the "divide" operation on the number.
     *
     * @example
     * boundNumber.divide(5);
     * // => x / 5
     */
    divide(factor: number): void;
    /**
     * Perform the "modulo" operation on the number.
     *
     * @example
     * boundNumber.modulo(5);
     * // => x % 5
     */
    modulo(factor: number): void;
    /**
     * Perform the "exponent" operation on the number;
     *
     * @example
     * boundNumber.exponent(5);
     * // => x ^ 5
     */
    exponent(factor: number): void;
    /**
     * Set the number to another number without mathematical operations.
     */
    assign(newValue: number): void;
    /**
     * Transforms the number to a string.
     *
     * @param digits The number of digits after the comma.
     */
    str(digits?: number): string;
}

/**
 * The type of the configuration.
 *
 * Specifications:
 * Type|Url
 * ---|---
 * JSON|https://www.json.org/json-en.html
 * Yaml|https://yaml.org/
 * HOCON|https://github.com/lightbend/config/blob/main/HOCON.md
 * Properties|https://github.com/avolgha/bibliothek/blob/dac77cbc6a6a96a3d745ebd1d0b61f164f2bf239/src/config/properties.ts
 */
declare type ConfigType = "json" | "yaml" | "hocon" | "properties";
/**
 * Load an configuration object from a file.
 *
 * @param file The file you want to load the configuration from.
 * @param type The type of the configuration.
 * @returns The loaded configuration.
 */
declare function cfg_load(file: string, type: ConfigType): any;
/**
 * Save a configuration objec to a file.
 *
 * @param file The file you want to save the configuration in.
 * @param object The object you want to save in the configuration file.
 * @param type The type of the configuration
 */
declare function cfg_save(file: string, object: any, type: ConfigType): void;

/**
 * Prettify bytes.
 *
 * @param bytes The amount of bytes you want to format.
 *
 * @return The prettified bytes.
 *
 * @example
 * fmt_bytes(1_730_405);
 * // => 1.73 MB
 */
declare function fmt_bytes(bytes: number): string;
/**
 * Format JSON to a string.
 *
 * **Warnings**:
 * 1. This function used "picocolors" to colorize the strings with ASCI-Colors. So it will only work in the console.
 * 2. This function can as well format strings, numbers, booleans, functions, symbols, etc. Providing these will *not* result is an error.
 *
 * @param json The JSON-Object to format.
 *
 * @return The result string.
 */
declare function fmt_json(json: any): string;
/**
 * Prettify dates to this format:
 * `(h:)m:s(:ms)`
 *
 * @param date The date you want to get the time from.
 *
 * @return The formatted date.
 */
declare function fmt_time(date: Date): string;

/**
 * Check if a file exists.
 *
 * @param path The path of the given file.
 *
 * @return Whether the file exists or not.
 */
declare function fs_exists(path: string): boolean;
/**
 * Create a file if it does not exists.
 *
 * @param path The path of the file.
 */
declare function fs_create(path: string): void;
/**
 * Write content to a file.
 *
 * @param path The path of the file.
 * @param content The string you want to write to the file.
 */
declare function fs_write(path: string, content: string): void;
/**
 * Read a file.
 *
 * @param path The path of the file.
 *
 * @return The contents of the file.
 */
declare function fs_read(path: string): string;
/**
 * Read a file and parse it as JSON.
 *
 * @param path The path of the file.
 *
 * @return The parsed JSON.
 */
declare function fs_json<T = any>(path: string): T;

declare type LazyValue<T> = {
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
declare function lazy<T>(evaluate: () => T): LazyValue<T>;

/**
 * Execute a given statement in a virtual machine and then log the result.
 *
 * **Warning**: Please check the code you give this function as input before
 * executing because the virtual machine *will* execute malicious code as
 * well.
 *
 * @param statement The statement to execute and log.
 * @param options Configuration options for the function.
 *
 * @example
 * log_statement("1 + 1");
 * // => [statement] 1 + 1 = 2
 *
 * @example
 * log_statement("1 + y", { context: { y: 5 }, printContext: true });
 * // => [statement] 1 + y = 6
 * // => [statement] context:
 * // => {
 * // =>   y: 5
 * // => }
 */
declare function log_statement(statement: string, options?: {
    context?: object;
    logger?: Logger;
    printContext?: boolean;
}): void;
/**
 * Simple Logger implementation.
 */
declare class Logger {
    #private;
    constructor();
    /**
     * Print an information message to the console.
     */
    info(...args: any[]): void;
    /**
     * Print a debug message to the console.
     */
    debug(...args: any[]): void;
    /**
     * Print a warnin message to the cosole.
     */
    warn(...args: any[]): void;
    /**
     * Print an error message to the console.
     */
    error(...args: any[]): void;
    /**
     * Print a raw message to the console.
     */
    raw(...args: any[]): void;
    /**
     * Print the current time to the console.
     */
    time(): void;
    /**
     * Prit formatted json to the console.
     */
    json(object: any): void;
    /**
     * Overwrite the existing JavaScript-console methods to the methods of this logger.
     */
    overwriteConsole(): void;
}

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
declare function num_range(from: number, to: number): number[];
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
declare function num_range_iter(from: number, to: number): Generator<number, void, unknown>;
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
declare function num_bound(initial: number | undefined, from: number, to: number): BoundNumber;
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
declare function num_between(num: number, upper: number, lower: number): boolean;
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
declare function num_between_inc(num: number, upper: number, lower: number): boolean;
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
declare function num_rand(max: number, min?: number): number;

/**
 * Create an object with default options and pass the other object on it.
 *
 * @example
 * obj_default({ a: 2, b: 1 }, { a: 1, c: 3 });
 * // => { a: 2, b: 1, c: 3 }
 */
declare function obj_default<A, B>(object: A, defaultObject: B): A & B;
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
declare function obj_flat(object: any): any;
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
declare function obj_key(object: any, key: string): any;

interface OsSpecResult {
    computer: {
        cpus: {
            list: os.CpuInfo[];
            usage: NodeJS.CpuUsage;
        };
        ipAddresses: string[];
        memory: {
            free: number;
            usage: NodeJS.MemoryUsage;
            total: number;
        };
        network: NodeJS.Dict<os.NetworkInterfaceInfo[]>;
        uptime: number;
    };
    os: {
        arch: "arm" | "arm64" | "ia32" | "mips" | "mipsel" | "ppc" | "ppc64" | "s390" | "s390x" | "x64";
        host: string;
        platform: NodeJS.Platform;
        release: string;
        type: string;
        version: string;
    };
    user: {
        home: string;
        info: os.UserInfo<string>;
        tmp: string;
    };
    node: {
        env: NodeJS.ProcessEnv;
        pid: number;
        release: NodeJS.ProcessRelease;
        title: string;
        versions: NodeJS.ProcessVersions;
    };
}
/**
 * Get computer specs like the cpus, the memory or the network interfaces.
 *
 * @return The specs from the current computer.
 */
declare function os_spec(): OsSpecResult;

/**
 * Format a string with templates.
 *
 * @param template The string you want to format.
 * @param objects The objects you want to pass in.
 * @param config Configuration of the function.
 *
 * @return The formatted string.
 *
 * @example
 * str_fmt("Hallo {}!", ["Welt"]);
 * // => "Hallo Welt!"
 *
 * @example
 * str_fmt("Test []", [1], { replace: "[]" });
 * // => "Test 1"
 */
declare function str_fmt(template: string, objects: any[], config?: {
    replace: string;
}): string;
/**
 * Count the number of times a specific sequence is in a given string.
 *
 * @param input The string you want to search in.
 * @param search The string you want to search for.
 *
 * @return The number of times the sequence appears in the target string.
 *
 * @example
 * str_count("Hallo Welt", "l");
 * // => 3
 *
 * @example
 * str_count("Hallo Welt", "x");
 * // => 0
 */
declare function str_count(input: string, search: string): number;
/**
 * Meassure the Levenshtein distance (or edit distance) between two strings.
 *
 * **Information**: https://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * @param target The first input string.
 * @param search The second input string.
 * @return The distance between the two strings.
 */
declare function str_distance(target: string, search: string): number;
/**
 * Meassure the Levenshtein distance (or edit distance) between one string and
 * an array of strings and get the nearest strings back.
 *
 * @param target The string you want to get the nearest from.
 * @param search The strings you want to search in.
 * @param amount The amount of strings you want to get back. If it is -1 *all*
 * 				 strings will be returned in order. If it is 1 only the first
 *               will be returned *without an array*. If it is >= 0 an array
 *               will be returned with the specificed amount of values.
 *               Otherwise will return `undefined`.
 * @return The nearest string(s)
 */
declare function str_nearest(target: string, search: string[], amount?: number): string | string[] | undefined;
/**
 * Repeat a string/ character a specific amount of times to produce a string.
 *
 * @param char The string/ character you want to repeat.
 * @param count The amount of times you want to repeat the string/ character.
 * @returns The resulting string.
 *
 * @example
 * str_repeat("H", 3);
 * // => HHH
 */
declare function str_repeat(char: string, count: number): string;

export { BoundNumber, LazyValue, Logger, OsSpecResult, arr, arr_delete, arr_flat, arr_rand, arr_rands, assert, assert_between, assert_equals, assert_matches, assert_number, cfg_load, cfg_save, fmt_bytes, fmt_json, fmt_time, fs_create, fs_exists, fs_json, fs_read, fs_write, lazy, log_statement, num_between, num_between_inc, num_bound, num_rand, num_range, num_range_iter, obj_default, obj_flat, obj_key, os_spec, str_count, str_distance, str_fmt, str_nearest, str_repeat };
