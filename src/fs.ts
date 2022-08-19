import fs from "fs";

/**
 * Check if a file exists.
 *
 * @param path The path of the given file.
 *
 * @return Whether the file exists or not.
 */
export function fs_exists(path: string): boolean {
	return fs.existsSync(path);
}

/**
 * Create a file if it does not exists.
 *
 * @param path The path of the file.
 */
export function fs_create(path: string) {
	if (!fs_exists(path)) fs_write(path, "");
}

/**
 * Write content to a file.
 *
 * @param path The path of the file.
 * @param content The string you want to write to the file.
 */
export function fs_write(path: string, content: string) {
	fs.writeFileSync(path, content);
}

/**
 * Read a file.
 *
 * @param path The path of the file.
 *
 * @return The contents of the file.
 */
export function fs_read(path: string): string {
	return fs.readFileSync(path, "utf-8");
}

/**
 * Read a file and parse it as JSON.
 *
 * @param path The path of the file.
 *
 * @return The parsed JSON.
 */
export function fs_json<T = any>(path: string): T {
	return JSON.parse(fs_read(path)) as T;
}
