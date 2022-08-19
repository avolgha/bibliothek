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
export function str_fmt(template: string, objects: any[], config: { replace: string } = { replace: "{}" }): string {
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

export function str_fmtjson(json: any, config?: { level?: number }): string {
	throw "method not implemented.";
}
