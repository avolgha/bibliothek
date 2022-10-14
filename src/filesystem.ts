import nodeFs from "fs";
import nodePath from "path";

/**
 * A simple declaration on how a simple file system should look like.
 */
export type FileSystem = {
    /**
     * Write content to a file in the file system.
     * 
     * @param path The path of the file.
     * @param content The content to write to the file.
     * @param type Whether to append to existing text or to overwrite all existing text.
     */
    write(path: string, content: string, type?: "append" | "overwrite"): void;

    /**
     * Read (and parse) content from a file in the file system.
     * 
     * @param path The path of the file.
     * @param parser An optional parser where you can already parse the output to a form you want to use.
     */
    read<T = string>(path: string, parser?: (input: string) => T): T | undefined;

    /**
     * Read a file from the file system and parse its content to JSON.
     * 
     * @param path The path of the file.
     */
    json<T>(path: string): T | undefined;

    /**
     * List all files (or parts) of a given directory in the file system.
     * 
     * **Warning**: In VirtualFS, it will check `startsWith` on all "buffers".
     * 
     * @param path The path of the directory.
     */
    dir(path: string): string[] | undefined;

    /**
     * Check if a file or directory does exists in the file system.
     * 
     * @param path The path of the file/ directory.
     */
    exists(path: string): boolean;

    /**
     * Get the type of an object in the file system.
     * 
     * @param path The path of the object.
     */
    type(path: string): "file" | "directory" | undefined;

    /**
     * Create a file in the file system.
     * 
     * Use `.write` if you want to write text on creation.
     * 
     * @param path The path of the file you want to create.
     */
    create(path: string): void;

    /**
     * Create a directory in the file system.
     * 
     * @param path The path of the directory you want to create.
     */
    mkdir(path: string): void;
};

export type FileSystemTypes =
    "virtual" |
    "relative" |
    "node";

/**
 * Initiate a file system.
 * 
 * Types:
 * - virtual (file system only existing in the memory)
 * - relative (file system relative to a given path)
 * - node (file system relative to `/`)
 * 
 * @param type The type of the file system you want to initiate.
 * @param path Optional path for relative file systems.
 * @returns The initiated file system.
 */
export function fs(type: FileSystemTypes, path?: string): FileSystem | undefined {
    if (type === "virtual") return new VirtualFileSystem();
    if (type === "relative") return path ? new RelativeFileSystem(path) : undefined;
    if (type === "node") return new AbsoluteFileSystem();
    return undefined;
}

class VirtualFileSystem implements FileSystem {
    #buffers: { [bufferName: string]: string } = {};

    write(path: string, content: string, type: "append" | "overwrite" = "overwrite"): void {
        const currentContent = type === "append" ? (this.read(path) || "") + "\n" : "";
        this.#buffers[path] = currentContent + content;
    }

    read<T = string>(path: string, parser?: ((input: string) => T) | undefined): T | undefined {
        if (!this.exists(path)) return undefined;
        const data = this.#buffers[path];
        /* eslint-disable-next-line */
        //@ts-ignore -- when parser is not available, T should always be a string, so no check needed (i hope)
        if (!parser) return data;
        return parser(data);
    }

    json<T>(path: string): T | undefined {
        return this.read<T>(path, (input) => JSON.parse(input));
    }

    dir(path: string): string[] | undefined {
        return Object.keys(this.#buffers).filter(bufferName => bufferName.startsWith(path));
    }

    exists(path: string): boolean {
        return this.#buffers[path] !== undefined;
    }

    /* eslint-disable-next-line */
    type(_path: string): "file" | "directory" | undefined {
        return undefined;
    }

    /* eslint-disable-next-line */
    create(_path: string): void { }

    /* eslint-disable-next-line */
    mkdir(_path: string): void { }
}

class RelativeFileSystem implements FileSystem {
    constructor(private rDir: string) { }

    write(path: string, content: string, type: "append" | "overwrite" = "overwrite"): void {
        const currentData = type === "append" ? (this.read(path) || "") + "\n" : "";
        nodeFs.writeFileSync(nodePath.join(this.rDir, path), currentData + content);
    }

    read<T = string>(path: string, parser?: ((input: string) => T)): T | undefined {
        if (!this.exists(path)) return undefined;
        const data = nodeFs.readFileSync(nodePath.join(this.rDir, path), "utf-8");
        /* eslint-disable-next-line */
        //@ts-ignore -- when parser is not available, T should always be a string, so no check needed (i hope)
        if (!parser) return data;
        return parser(data);
    }

    json<T>(path: string): T | undefined {
        return this.read<T>(path, (input) => JSON.parse(input));
    }

    dir(path: string): string[] | undefined {
        if (this.type(path) !== "directory") return undefined;
        return nodeFs.readdirSync(nodePath.join(this.rDir, path), "utf-8");
    }

    exists(path: string): boolean {
        return nodeFs.existsSync(nodePath.join(this.rDir, path));
    }

    type(path: string): "file" | "directory" | undefined {
        if (!this.exists(path)) return undefined;
        const stat = nodeFs.statSync(nodePath.join(this.rDir, path));
        if (stat.isFile()) return "file";
        if (stat.isDirectory()) return "directory";
        return undefined;
    }

    create(path: string): void {
        if (this.exists(path)) return;
        this.write(path, "", "overwrite");
    }

    mkdir(path: string): void {
        if (this.exists(path)) return;
        nodeFs.mkdirSync(nodePath.join(this.rDir, path));
    }
}

class AbsoluteFileSystem implements FileSystem {
    write(path: string, content: string, type: "append" | "overwrite" = "overwrite"): void {
        const currentData = type === "append" ? (this.read(path) || "") + "\n" : "";
        nodeFs.writeFileSync(path, currentData + content);
    }

    read<T = string>(path: string, parser?: ((input: string) => T)): T | undefined {
        if (!this.exists(path)) return undefined;
        const data = nodeFs.readFileSync(path, "utf-8");
        /* eslint-disable-next-line */
        //@ts-ignore -- when parser is not available, T should always be a string, so no check needed (i hope)
        if (!parser) return data;
        return parser(data);
    }

    json<T>(path: string): T | undefined {
        return this.read<T>(path, (input) => JSON.parse(input));
    }

    dir(path: string): string[] | undefined {
        if (this.type(path) !== "directory") return undefined;
        return nodeFs.readdirSync(path, "utf-8");
    }

    exists(path: string): boolean {
        return nodeFs.existsSync(path);
    }

    type(path: string): "file" | "directory" | undefined {
        if (!this.exists(path)) return undefined;
        const stat = nodeFs.statSync(path);
        if (stat.isFile()) return "file";
        if (stat.isDirectory()) return "directory";
        return undefined;
    }

    create(path: string): void {
        if (this.exists(path)) return;
        this.write(path, "", "overwrite");
    }

    mkdir(path: string): void {
        if (this.exists(path)) return;
        nodeFs.mkdirSync(path);
    }
}