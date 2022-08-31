import vm from "vm";
import pico from "picocolors";
import { fmt_json } from "./fmt.js";
import { obj_default } from "./object.js";

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
export function log_statement(
    statement: string,
    options?: { context?: object; logger?: Logger; printContext?: boolean }
) {
    const { context, logger, printContext } = obj_default(options, {});
    const ctx = { ...(context || {}), result: undefined };
    vm.createContext(ctx);
    vm.runInContext(`result = (${statement});`, ctx);
    const result = ctx.result;

    if (logger) {
        logger.raw(pico.magenta("statement:"), `${statement} = ${result}\n`);
        printContext === true &&
            logger.raw(
                pico.magenta("statement:"),
                `=> context: ${fmt_json(context)}\n`
            );
    } else {
        process.stdout.write(`[statement] ${statement} = ${result}\n`);
        printContext === true &&
            process.stdout.write(
                `[statement] => context: ${fmt_json(context)}\n`
            );
    }
}

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
        this.#print(process.stdout, pico.green("info:"), ...args, "\n");
    }

    /**
     * Print a debug message to the console.
     */
    debug(...args: any[]) {
        this.#print(process.stdout, pico.cyan("debug:"), ...args, "\n");
    }

    /**
     * Print a warnin message to the cosole.
     */
    warn(...args: any[]) {
        this.#print(process.stderr, pico.yellow("warn:"), ...args, "\n");
    }

    /**
     * Print an error message to the console.
     */
    error(...args: any[]) {
        this.#print(process.stderr, pico.red("error:"), ...args, "\n");
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
        this.#print(process.stdout, pico.gray("json:"), fmt_json(object), "\n");
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
