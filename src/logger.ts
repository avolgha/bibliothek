import fs from "fs";
import vm from "vm";
import colors from "./internal/colors";
import { fmt_json } from "./fmt";
import { obj_default } from "./object";

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
        logger.raw(colors.magenta("statement:"), `${statement} = ${result}\n`);
        printContext === true &&
            logger.raw(
                colors.magenta("statement:"),
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
 * Interface for declaring what an Logger should look like in our library.
 * 
 * For implementations, see:
 * - Logger
 * - FullLogger
 */
export interface ILogger {
    info(...args: any[]): void;
    debug(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    raw(...args: any[]): void;
    time(): void;
    json(object: any): void;
}

/**
 * Simple Logger implementation.
 */
export class Logger implements ILogger {
    constructor(public _debugMode = Object.keys(process.env).includes("DEBUG")) {
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
        this.#print(process.stdout, colors.green("info:"), ...args, "\n");
    }

    /**
     * Print a debug message to the console.
     * 
     * The output of this function is controlled by the variable `_debugMode`.
     */
    debug(...args: any[]) {
        this._debugMode && this.#print(process.stdout, colors.cyan("debug:"), ...args, "\n");
    }

    /**
     * Print a warnin message to the cosole.
     */
    warn(...args: any[]) {
        this.#print(process.stderr, colors.yellow("warn:"), ...args, "\n");
    }

    /**
     * Print an error message to the console.
     */
    error(...args: any[]) {
        this.#print(process.stderr, colors.red("error:"), ...args, "\n");
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
        this.#print(
            process.stdout,
            colors.gray("json:"),
            fmt_json(object),
            "\n"
        );
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

    /**
     * Controle whether the Logger should print out debug messages.
     */
    setDebugMode(state: boolean) {
        this._debugMode = state;
    }
}

export interface FullLoggerOutputDeviceFile {
    path: string;
}

export type FullLoggerOutputDeviceWritable = {
    write(chunk: string): void;
}

export type FullLoggerOutputDevice = FullLoggerOutputDeviceWritable | FullLoggerOutputDeviceFile;

/**
 * An a bit more complex logger implementation that can handle file and writable outputs.
 * 
 * In the constructor, you need to provide the device (file or writable) you want to print to.
 */
export class FullLogger implements ILogger {
    constructor(public device: FullLoggerOutputDevice) {
        if (!device) {
            throw "error: full logger has to be configured with an output device.";
        }
    }

    #ctime() {
        return new Date().toLocaleString();
    }

    #printR(...args: any[]) {
        if (Object.hasOwn(this.device, "path")) {
            const { path } = this.device as FullLoggerOutputDeviceFile;

            if (!fs.existsSync(path)) {
                fs.writeFileSync(path, "");
            }

            fs.writeFileSync(path, args.join(" "));
        } else {
            const writable = this.device as FullLoggerOutputDeviceWritable;

            writable.write(args.join(" "));
        }
    }

    #print(...args: any[]) {
        this.#printR(`[${this.#ctime()}]`, ...args);
    }

    info(...args: any[]): void {
        this.#print("[info]", ...args);
    }

    debug(...args: any[]): void {
        this.#print("[debug]", ...args);
    }

    warn(...args: any[]): void {
        this.#print("[warn]", ...args);
    }

    error(...args: any[]): void {
        this.#print("[error]", ...args);
    }

    raw(...args: any[]): void {
        this.#printR(...args);
    }

    time(): void {
        this.#printR(this.#ctime());
    }

    json(object: any): void {
        this.#print("[json]", JSON.stringify(object, undefined, 4));
    }
}
