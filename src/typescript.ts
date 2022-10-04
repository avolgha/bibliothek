import child from "child_process";
import fs from "fs";
import fsp from "fs/promises";
import os from "os";
import path from "path";

/**
 * Execute a single TypeScript-file.
 * 
 * For the execution, you need to install `esbuild` as dependency.
 * 
 * @param scriptFile The name of the TypeScript-source file that you want to execute.
 * @param printTime Determine whether the time we needed for compiling and executing should be printed after the execution.
 * 
 * @return The amount of time the function needed to compile and execute the script.
 */
export async function run_typescript(scriptFile: string, printTime = false) {
    scriptFile = path.resolve(scriptFile);
    if (!fs.existsSync(scriptFile)) {
        throw new Error("bibliothek-typescript: requested script file does not exists: " + scriptFile);
    }

    if (!scriptFile.endsWith(".ts")) {
        throw new Error("bibliothek-typescript: we need any typescript source file to have `.ts` as extension, your file seems not to have it.");
    }

    const start = new Date().getTime();

    // we dont require the users of the library to install esbuild by default because it can be really
    // heavy and it is not essential. Because of that, we have it listed as a "peerDependency", so we
    // can require it here later when we want to use it.
    const esbuild = await import("esbuild").catch(() => {
        throw new Error("bibliothek-typescript: for the typescript module we need `esbuild` to be installed.");
    });

    // format: %TMP%/bibliothek-typescript-XXXXXX
    const tmpPath = await fsp.mkdtemp(path.join(os.tmpdir(), "bibliothek-typescript-"), { encoding: "utf-8" });
    const jsPath = path.join(tmpPath, "script.js");

    const result = await esbuild.transform(fs.readFileSync(scriptFile, "utf-8"), {
        charset: "utf8",
        sourcemap: "inline"
    });
    if (result.warnings) {
        result.warnings.forEach((value) => {
            console.warn("bibliothek-typescript: warning from compiler: " + value.text);
        });
    }

    await fsp.writeFile(jsPath, result.code, "utf-8");

    await (() => {
        return new Promise<void>((res, rej) => {
            const proc = child.spawn("node", [jsPath], {
                cwd: tmpPath,
                env: process.env,
            });

            const trimLog = (txt: Buffer) => {
                let res = txt.toString("utf-8");
                res = res.trim();
                if (res.endsWith("\n")) res = res.substring(0, res.length - "\n".length);
                return res;
            };

            proc.stdout.on("data", (chunk) => console.log("bibliothek-typescript [stdout]: " + trimLog(chunk)));
            proc.stderr.on("data", (chunk) => console.log("bibliothek-typescript [stderr]: " + trimLog(chunk)));

            proc.on("close", (code) => {
                code === 0 ? res() : rej();
            });
        });
    })();

    await fsp.rm(tmpPath, { recursive: true });

    const end = new Date().getTime();
    const timeNeeded = end - start; // in "ms"

    if (printTime) {
        const seconds = Math.trunc(timeNeeded / 1000);
        const millis = timeNeeded % 1000;

        console.log(`bibliothek-typescript: needed ${seconds}s ${millis}ms`);
    }

    return timeNeeded;
}