import picoCreateColors from "../third_party/picocolors.js";
//@ts-ignore
const pico = picoCreateColors();

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
export function fmt_bytes(bytes: number): string {
	if (!Number.isFinite(bytes)) throw `cannot format non-finite number: ${bytes}`;
	if (bytes === 0) return "0 B";
	if (bytes < 0) bytes = -bytes;
	if (bytes < 1) return `${bytes} B`;

	const units = [
		"B",
		"kB",
		"MB",
		"GB",
		"TB",
		"PB",
	];
	const exponent = Math.min(Math.floor(Math.log10(bytes) / 3), units.length - 1);
	bytes /= 1000 ** exponent;

	const unit = units[exponent];
	return `${bytes.toPrecision(3)} ${unit}`;
}

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
export function fmt_json(json: any): string {
	function _by_type(some: any): (x: any, level?: number) => string {
		switch (typeof some) {
			case "string":
				return _str;
			case "number":
				return _num;
			case "boolean":
				return _bool;
			case "function":
				return _fn;
			case "symbol":
				return _sym;
			case "undefined":
				return _und;
			default:
				return Array.isArray(some) ? _arr : _obj;
		}
	}

	function _num(num: number): string {
		return pico.yellow(num);
	}

	function _str(str: string): string {
		return pico.green(`"${str}"`);
	}

	function _bool(bool: boolean): string {
		return pico.yellow(bool ? "true" : "false");
	}

	function spaces(times: number): string {
		let str = "";
		for (let i = 0; i < times; i++) {
			str += " ";
		}
		return str;
	}

	function _obj(obj: any, level = 0): string {
		function _fmt_key(key: string): string {
			return key.includes(" ") ? `"${key}"` : key;
		}

		const keys = Object.keys(obj);

		if (keys.length === 0) return pico.white("{}");

		let str = "{";

		let i = 0;
		for (const key of keys) {
			str += `\n${spaces((level + 1) * 2)}${_fmt_key(key)}: ${_by_type(obj[key])(obj[key], level + 1)}${i === (keys.length - 1) ? "" : ","}`;
			i++;
		}

		return pico.white(`${str}\n${spaces(level * 2)}}`);
	}

	function _arr(arr: any[], level = 0): string {
		if (arr.length === 0) return "[]";

		let str = "[";

		let i = 0;
		for (const obj of arr) {
			str += `\n${spaces((level + 1) * 2)}${_by_type(obj)(obj, level + 1)}${i === (arr.length - 1) ? "" : ","}`;
			i++;
		}

		return `${str}\n${spaces(level * 2)}]`;
	}

	function _fn(_: any): string {
		return pico.cyan("[Function]");
	}

	function _sym(sym: Symbol): string {
		return pico.green(`[Symbol (${sym.description})]`);
	}

	function _und(_: any): string {
		return pico.gray("undefined");
	}

	return _by_type(json)(json);
}

/**
 * Prettify dates to this format:
 * `(h:)m:s(:ms)`
 *
 * @param date The date you want to get the time from.
 *
 * @return The formatted date.
 */
export function fmt_time(date: Date): string {
	let ms = date.getTime(), s = 0, min = 0, h = 0;

	while (ms >= 1000) {
		ms -= 1000;
		s++;
	}

	while (s >= 60) {
		s /- 60;
		min++;
	}

	while (min >= 60) {
		min -= 60;
		h++;
	}

	let str = "";
	if (h > 0) str += `${h}h `;
	str += `${min}m ${s}s ${ms}ms`;

	return str;
}