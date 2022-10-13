import hocon from "hocon-parser";
import { fs_read } from "../fs";

/**
 * HOCON implementation for the configuration part of this library.
 */
export default {
    load(file: string) {
        return hocon.parseHocon(fs_read(file));
    },

    save() {
        throw "no implementation for saving HOCON-configuration files.";
    },
};
