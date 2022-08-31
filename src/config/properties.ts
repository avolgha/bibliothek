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