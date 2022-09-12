import hocon from "./config/hocon";
import json from "./config/json";
import properties from "./config/properties";
import yaml from "./config/yaml";

/**
 * The type of the configuration.
 *
 * Specifications:
 * Type|Url
 * ---|---
 * JSON|https://www.json.org/json-en.html
 * Yaml|https://yaml.org/
 * HOCON|https://github.com/lightbend/config/blob/main/HOCON.md
 * Properties|https://github.com/avolgha/bibliothek/blob/dac77cbc6a6a96a3d745ebd1d0b61f164f2bf239/src/config/properties.ts
 */
export type ConfigType = "json" | "yaml" | "hocon" | "properties";

const configs: Map<
    ConfigType,
    {
        load(file: string): any;
        save(file: string, object: any): void;
    }
> = new Map([
    ["json", json],
    ["yaml", yaml],
    ["hocon", hocon],
    ["properties", properties],
]);

/**
 * Load an configuration object from a file.
 *
 * @param file The file you want to load the configuration from.
 * @param type The type of the configuration.
 * @returns The loaded configuration.
 */
export function cfg_load(file: string, type: ConfigType) {
    return configs.get(type)?.load(file);
}

/**
 * Save a configuration objec to a file.
 *
 * @param file The file you want to save the configuration in.
 * @param object The object you want to save in the configuration file.
 * @param type The type of the configuration
 */
export function cfg_save(file: string, object: any, type: ConfigType) {
    configs.get(type)?.save(file, object);
}
