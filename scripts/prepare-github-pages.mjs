import { copyFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "dist", "github-pages");
const demoEntry = path.join(outputDirectory, "github-pages.html");
const pagesEntry = path.join(outputDirectory, "index.html");

await copyFile(demoEntry, pagesEntry);
await rm(demoEntry);

console.log("GitHub Pages artifact prepared at dist/github-pages/index.html");
