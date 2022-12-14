import yaml from "js-yaml";
import { fs_read, fs_write } from "../fs";

/**
 * YAML implementation for the configuration part of this library.
 */
export default {
    load(file: string) {
        return yaml.load(fs_read(file));
    },

    save(file: string, object: unknown) {
        fs_write(file, yaml.dump(object));
    },
};
