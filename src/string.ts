import leven from "./internal/leven";

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
export function str_fmt(
    template: string,
    objects: any[],
    config: { replace: string } = { replace: "{}" }
): string {
    const { replace } = config;
    while (template.includes(replace) && objects.length > 0) {
        template = template.replace(replace, objects.shift());
    }
    return template;
}

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
export function str_count(input: string, search: string): number {
    const matches = input.match(new RegExp(search, "g"));
    if (matches === null) {
        return 0;
    }

    return matches.length;
}

/**
 * Meassure the Levenshtein distance (or edit distance) between two strings.
 *
 * **Information**: https://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * @param target The first input string.
 * @param search The second input string.
 * @return The distance between the two strings.
 */
export function str_distance(target: string, search: string): number {
    return leven(target, search);
}

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
export function str_nearest(
    target: string,
    search: string[],
    amount = 1
): string | string[] | undefined {
    if (search.length === 0) return undefined;
    let distances: { [s: string]: number } = {};
    const sortedArray = search
        .sort(
            (first, second) =>
                (distances[first] ||
                    (distances[first] = str_distance(first, target))) -
                (distances[second] ||
                    (distances[second] = str_distance(second, target)))
        )
        .reverse();
    if (amount === -1) return sortedArray;
    else if (amount === 1) return sortedArray[0];
    else if (amount >= 0) return sortedArray.slice(0, amount);
}

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
export function str_repeat(char: string, count: number) {
    return (count > 0 ? Array(count).fill(char) : []).join("");
}
