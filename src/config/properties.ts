/*

=== Properties format:

This format should look a bit like the Java-Properties format.
The core consists of this:
<key>=<value>

That means that a key (constructed through letters, numbers and dots)
has to be followed by an equality operator and then the value
you want to pass in.

Notice, that booleans and numbers WILL be passed in as strings, so
no converting will happen from the side of the library itself.

=== Examples:

hallo.welt=Hallo Welt
my.name=Marius
my.age=3

This results to:

{
  "hallo": {
    "welt": "Hallo Welt"
  },
  "my": {
    "name": "Marius",
    "age": "3"
  }
}

*/

import { unflatten } from "flat";
import { fs_read, fs_write } from "../fs"

type Obj = { [key: string]: string };

/**
 * Java-like Properties implementation for the configuration part of this library.
 */
export default {
    load(file: string) {
        const content = fs_read(file);
        let object: Obj = {};

        for (const line of content.split("\n")) {
            if (line.trim().replaceAll("\n", "") === "") continue;

            const matches = /^([a-zA-Z0-9.-]+)=(.+)$/g.exec(line);

            if (!matches) {
                throw `unknown configuration format: "<key>=<value>" does not match: "${line}".`;
            }

            const [key, value] = matches;
            object[key] = value;
        }

        return unflatten(object);
    },

    save(file: string, object: any) {
        const string = Object.keys(object).map((key) => `${key}=${object[key]}`).join("\n");
        fs_write(file, string);
    }
}