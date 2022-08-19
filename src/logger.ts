import {  str_fmtjson } from "./string.js";

/**
 * Simple Logger implementation.
 */
export class Logger {
	constructor() {
		if (!process || !process.stdout || !process.stderr) {
			throw "error: for the logger, we require to have a node.js environment or a node.js procss-like constant set";
		}
	}

	#print(std: NodeJS.WriteStream, ...args: any[]) {
		std.write(args.join(" "));
	}

	/**
	 * Print an information message to the console.
	 */
	info(...args: any[]) {
		this.#print(process.stdout, "[info]", ...args);
	}

	/**
	 * Print a debug message to the console.
	 */
	debug(...args: any[]) {
		this.#print(process.stdout, "[debug]", ...args);
	}

	/**
	 * Print a warnin message to the cosole.
	 */
	warn(...args: any[]) {
		this.#print(process.stderr, "[warn]", ...args);
	}

	/**
	 * Print an error message to the console.
	 */
	error(...args: any[]) {
		this.#print(process.stderr, "[error]", ...args);
	}

	/**
	 * Print a raw message to the console.
	 */
	raw(...args: any[]) {
		this.#print(process.stdout, ...args);
	}

	/**
	 * Print the current time to the console.
	 */
	time() {
		this.info(new Date().toLocaleString());
	}

	/**
	 * Prit formatted json to the console.
	 */
	json(object: any) {
		this.#print(process.stdout, "[json]", str_fmtjson(object))
	}

	/**
	 * Overwrite the existing JavaScript-console methods to the methods of this logger.
	 */
	overwriteConsole() {
		console.log = console.info = this.info;
		console.debug = this.debug;
		console.warn = this.warn;
		console.error = this.error;
	}
}
