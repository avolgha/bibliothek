import { arr } from "./array";
import { obj_default } from "./object";
import { str_repeat } from "./string";

export interface RawArguments {
    flags: string[];
    other: string[];
    utilities: {
        help: boolean;
        version: boolean;
    }
}

/**
 * Parse the console line arguments in a simple way.
 * 
 * The function will detect flags and additional content.
 * It will also notice you if it can detect help or version flags. 
 * 
 * @param argv The arguments you want to pass into the parser.
 * @returns The raw arguments that were parsed.
 */
export function cli_parse_raw(argv = process.argv): RawArguments {
    const flags = arr<string>();
    const other = arr<string>();

    for (const arg of argv) {
        if (!arg.startsWith("-")) {
            other.push(arg);
            continue;
        }

        if (arg.startsWith("--")) {
            flags.push(arg.substring(2));
        } else {
            flags.push(...arg.substring(1).split(""));
        }
    }

    return {
        flags,
        other,
        utilities: {
            help: flags.some((flag) => flag === "help" || flag === "H"),
            version: flags.some((flag) => flag === "version" || flag === "V"),
        },
    };
}

/**
 * Interface for representing the arguments in the cli_parse function.
 */
export interface CliParseOptions {
    /**
     * The arguments you want to pass into the argument parser.
     * 
     * Default to `process.argv`.
     */
    argv: string[];
    /**
     * The flags that you want to allow in your project.
     * 
     * You can specify short flags that will be converted to long flags later on.
     * 
     * Default to `all flags allowed` (`undefined`).
     * 
     * @example
     * ```typescript
     * {
     *   short: {
     *     V: "version",
     *   },
     *   long: [ "version", ],
     * }
     * ```
     */
    allowedFlags?: {
        /**
         * Short flags names that redirect to long flag names.
         */
        short: { [short: string]: string },
        /**
         * The long names of the flags.
         */
        long: string[],
    };
    /**
     * Should additonal (non-flag) content be allowed and parsed my the parser.
     * 
     * Default to `true`.
     */
    allowAdditional: boolean;
}

export interface Arguments {
    flags: string[];
    additional?: string[];
}

export type ParseError = `error: ${string}`;

/**
 * Parse the console line options in a more complex way.
 * 
 * @param options The options for the function.
 * @returns An object with the arguments or an error that occurred in the process represented as a string.
 */
export function cli_parse(options: Partial<CliParseOptions>): Arguments | ParseError {
    const {
        argv,
        allowedFlags,
        allowAdditional,
    } = obj_default<Partial<CliParseOptions>, CliParseOptions>(options, {
        argv: process.argv,
        allowAdditional: true,
    });

    const flags = arr<string>();
    const additional = arr<string>();

    for (const arg of argv) {
        // check if the argument is not a flag.
        // if the argument does not start with a dash, it is not a flag
        if (!arg.startsWith("-")) {
            if (allowAdditional === false) {
                return "error: only allows flags as arguments.";
            }

            additional.push(arg);
            continue;
        }

        if (arg.startsWith("--")) {
            const flag = arg.substring(2);
            if (allowedFlags === undefined) {
                flags.push(flag);
            } else {
                if (allowedFlags.long.includes(flag)) {
                    flags.push(flag);
                } else {
                    return `error: flag (--${flag}) is not allowed.`;
                }
            }
            continue;
        }

        const flagSubs = arg.substring(1).split("");

        if (allowedFlags === undefined) {
            flags.push(...flagSubs);
            continue;
        }

        for (const sub of flagSubs) {
            const longFlag = allowedFlags.short[sub];
            if (longFlag === undefined) {
                return `error: flag (-${sub}) is not allowed.`;
            }

            flags.push(longFlag);
        }
    }

    return {
        flags,
        additional,
    };
}

/**
 * Generate a custom usage string for your console application.
 * 
 * @param strings The options you want to pass into the generator.
 * @returns The generated usage string.
 */
export function cli_usage(strings: {
    name: string;
    version: string;
    description: string;
    author?: {
        name: string;
        website?: string;
        email?: string;
    };
    license?: string;
    usage: string;
    flags: {
        [flag: string]: string;
    };
    examples?: string[];
}) {
    function formatExamples(examples: (typeof strings)["examples"]) {
        if (!examples) return "";

        let s = "EXAMPLES\n";

        let i = 1;
        for (const example of examples) {
            s += ` ${i}) ${example}\n`;
            i++;
        }

        return s;
    }

    function formatFlags(flags: (typeof strings)["flags"]) {
        let s = "FLAGS\n";
        const keys = Object.keys(flags);

        const widestWidth = keys.reduce(function (a, b) {
            return a.length > b.length ? a : b;
        }).length;

        for (const key of keys) {
            const value = flags[key];

            s += `    ${str_repeat(" ", widestWidth - key.length)}${key} : ${value}\n`;
        }

        return s;
    }

    function formatAuthor(author: (typeof strings)["author"]) {
        if (!author) return "";

        let s = `CONTACT
    Name: ${author.name}\n`;
        if (author.website) s += `    Web:  ${author.website}\n`;
        if (author.email) s += `    Mail: ${author.email}\n`;
        return s;
    }

    return `
${strings.name} v${strings.version}${strings.license ? ` (License: ${strings.license})` : ""}

DESCRIPTION
    ${strings.description.split("\n").join("\n    ")}

USAGE
    ${strings.usage}

${formatFlags(strings.flags)}
${formatExamples(strings.examples)}
${formatAuthor(strings.author)}`.trim();
}