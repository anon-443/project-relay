import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "dist", "github-pages");
const port = Number(process.env.PORT || 4174);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname)
    .replace(/^\/project-relay\/?/, "");
  const requestedPath = path.resolve(outputDirectory, pathname || "index.html");
  const safePath = requestedPath.startsWith(outputDirectory) ? requestedPath : path.join(outputDirectory, "index.html");

  try {
    const target = (await stat(safePath)).isDirectory() ? path.join(safePath, "index.html") : safePath;
    const extension = path.extname(target);
    response.writeHead(200, { "Content-Type": contentTypes[extension] || "application/octet-stream" });
    response.end(await readFile(target));
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Static GitHub Pages preview available on port ${port}`);
});
