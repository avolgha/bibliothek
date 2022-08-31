import cproc from "child_process";
import fs from "fs";
import path from "path";

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));

const header = `/*!
 * bibliothek v${pkg.version} (https://github.com/avolgha/bibliothek/)
 * Copyright present to 2022 avolgha and bibliothek contributors (https://github.com/avolgha/bibliothek/graphs/contributors)
 * Licensed under MIT (https://github.com/avolgha/bibliothek/blob/dev/LICENSE)
 */`;

cproc.execSync("yarn package");

const buildDir = path.resolve(process.cwd(), "build");
const bundle = fs.readFileSync(path.join(buildDir, "main.js"), "utf-8");
const dts = fs.readFileSync(path.join(buildDir, "main.d.ts"), "utf-8");

fs.writeFileSync(path.join(process.cwd(), "scripts", "bibliothek.js"), `${header}\n${bundle}`);
fs.writeFileSync(path.join(process.cwd(), "scripts", "bibliothek.d.ts"), `${header}\n\n${dts}`);

console.log(`
================================
=  Bundle files output to:     =
=   > scripts/bibliothek.js    =
=   > scripts/bibliothek.d.ts  =
================================
`);