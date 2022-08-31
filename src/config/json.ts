import { fs_json, fs_write } from "../fs";

/**
 * JSON implementation for the configuration part of this library.
 */
export default {
  load(file: string) {
    return fs_json(file);
  },

  save(file: string, object: any) {
    fs_write(file, JSON.stringify(object, undefined, 4));
  }
};