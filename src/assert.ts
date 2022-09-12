import { Logger } from "./logger";
import { num_between } from "./number";

const assertLogger = new Logger();

function _error(general: string, dev: string, exitCode = 1) {
    assertLogger.error(`${general}: ${dev}`);
    process.exit(exitCode);
}

export function assert(statement: boolean, message: string) {
    if (!statement) _error("assertion of statement failed", message);
}

export function assert_equals<T>(first: T, second: T, message: string) {
    assert(
        (() => {
            if (
                //@ts-ignore
                first["equals"] !== undefined &&
                //@ts-ignore
                typeof first["equals"] === "function"
            )
                //@ts-ignore
                return first["equals"](second);
            else if (
                //@ts-ignore
                second["equals"] !== undefined &&
                //@ts-ignore
                typeof second["equals"] === "function"
            )
                //@ts-ignore
                return second["equals"](first);
            return first === second;
        })(),
        message
    );
}

export function assert_between(
    value: number,
    max: number,
    min: number,
    message: string
) {
    assert(num_between(value, max, min), message);
}

export function assert_number(value: any, message: string): number {
    if (typeof value === "number") {
        return value;
    } else if (typeof value === "string") {
        return parseInt(value);
    } else {
        _error(`given value (${value}) is no number`, message);
        throw ""; // should not reach this here because of process#exit in line before.
    }
}

export function assert_matches<T>(
    value: T,
    matches: {
        message: string;
        function: (input: T) => boolean;
    }[]
) {
    let index = 0;
    for (const match of matches) {
        if (!match.function(value))
            _error(
                "assertion failed on assertion-check #" + index,
                match.message
            );
        index++;
    }
}
