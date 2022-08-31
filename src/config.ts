import hocon from "./config/hocon";
import json from "./config/json";
import yaml from "./config/yaml";

/**
 * The type of the configuration.
 */
export type ConfigType = "json" | "yaml" | "hocon";

const configs: Map<ConfigType, {
    load(file: string): any;
    save(file: string, object: any): void;
}> = new Map([
    ["json", json],
    ["yaml", yaml],
    ["hocon", hocon],
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