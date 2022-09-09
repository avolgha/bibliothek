/* taken and modified from flat by hughsk | https://github.com/hughsk/flat | BSD-3-Clause License : https://github.com/hughsk/flat/blob/master/LICENSE */

function isBuffer(obj: any) {
    return (
        obj &&
        obj.constructor &&
        typeof obj.constructor.isBuffer === "function" &&
        obj.constructor.isBuffer(obj)
    );
}

const keyIdentity: Required<FlattenOptions>["transformKey"] = (key) => {
    return key;
};

export interface FlattenOptions {
    delimiter?: string;
    maxDepth?: number;
    safe?: boolean;
    transformKey?: (key: string) => string;
}

export function flatten<T, R>(target: T, opts?: FlattenOptions): R {
    opts = opts || {};

    const delimiter = opts.delimiter || ".";
    const maxDepth = opts.maxDepth;
    const transformKey = opts.transformKey || keyIdentity;
    const output: { [key: string]: any } = {};

    function step(object: any, prev?: any, currentDepth = 0) {
        currentDepth = currentDepth || 1;
        Object.keys(object).forEach(function (key) {
            const value = object[key];
            const isarray = opts!.safe && Array.isArray(value);
            const type = Object.prototype.toString.call(value);
            const isbuffer = isBuffer(value);
            const isobject =
                type === "[object Object]" || type === "[object Array]";

            const newKey = prev
                ? prev + delimiter + transformKey(key)
                : transformKey(key);

            if (
                !isarray &&
                !isbuffer &&
                isobject &&
                Object.keys(value).length &&
                (!opts!.maxDepth || currentDepth < maxDepth!)
            ) {
                return step(value, newKey, currentDepth + 1);
            }

            output[newKey] = value;
        });
    }

    step(target);

    return output as R;
}

export interface UnflattenOptions {
    delimiter?: string;
    object?: boolean;
    overwrite?: boolean;
    transformKey?: (key: string) => string;
}

export function unflatten<
    T extends {
        [key: string]: any;
    },
    R
>(target: T, opts?: UnflattenOptions): R {
    opts = opts || {};

    const delimiter = opts.delimiter || ".";
    const overwrite = opts.overwrite || false;
    const transformKey = opts.transformKey || keyIdentity;
    const result: {
        [key: string]: any;
    } = {};

    const isbuffer = isBuffer(target);
    if (
        isbuffer ||
        Object.prototype.toString.call(target) !== "[object Object]"
    ) {
        //@ts-ignore
        return target;
    }

    // safely ensure that the key is
    // an integer.
    function getkey(key: string) {
        const parsedKey = Number(key);

        return isNaN(parsedKey) || key.indexOf(".") !== -1 || opts!.object
            ? key
            : parsedKey;
    }

    function addKeys(keyPrefix: string, recipient: any, target: any) {
        return Object.keys(target).reduce(function (result, key) {
            result[keyPrefix + delimiter + key] = target[key];

            return result;
        }, recipient);
    }

    function isEmpty(val: any) {
        const type = Object.prototype.toString.call(val);
        const isArray = type === "[object Array]";
        const isObject = type === "[object Object]";

        if (!val) {
            return true;
        } else if (isArray) {
            return !val.length;
        } else if (isObject) {
            return !Object.keys(val).length;
        }
    }

    target = Object.keys(target).reduce(
        function (result, key) {
            const type = Object.prototype.toString.call(target[key]);
            const isObject =
                type === "[object Object]" || type === "[object Array]";
            if (!isObject || isEmpty(target[key])) {
                result[key] = target[key];
                return result;
            } else {
                return addKeys(key, result, flatten(target[key], opts));
            }
        },
        {} as {
            [key: string]: any;
        }
    ) as T;

    Object.keys(target).forEach(function (key) {
        const split = key.split(delimiter).map(transformKey);
        let key1 = getkey(split.shift()!);
        let key2 = getkey(split[0]);
        let recipient = result;

        while (key2 !== undefined) {
            if (key1 === "__proto__") {
                return;
            }

            const type = Object.prototype.toString.call(recipient[key1]);
            const isobject =
                type === "[object Object]" || type === "[object Array]";

            // do not write over falsey, non-undefined values if overwrite is false
            if (
                !overwrite &&
                !isobject &&
                typeof recipient[key1] !== "undefined"
            ) {
                return;
            }

            if (
                (overwrite && !isobject) ||
                (!overwrite && recipient[key1] == null)
            ) {
                recipient[key1] =
                    typeof key2 === "number" && !opts!.object ? [] : {};
            }

            recipient = recipient[key1];
            if (split.length > 0) {
                key1 = getkey(split.shift()!);
                key2 = getkey(split[0]);
            }
        }

        // unflatten again for 'messy objects'
        recipient[key1] = unflatten(target[key], opts);
    });

    return result as R;
}
