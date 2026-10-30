// Pre-deploy check: JS syntax + every local asset referenced by the site exists.
// Usage: node scripts/check.mjs   (no dependencies)
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;

for (const f of ["js/data.js", "js/audio.js", "js/cursor.js", "js/main.js"]) {
  try { execFileSync(process.execPath, ["--check", join(root, f)], { stdio: "pipe" }); console.log("ok   syntax  " + f); }
  catch (e) { failed++; console.error("FAIL syntax  " + f + "\n" + e.stderr); }
}

const sources = ["index.html", "js/data.js", "css/style.css"].map((f) => readFileSync(join(root, f), "utf8")).join("\n");
const refs = new Set();
for (const m of sources.matchAll(/(src|href|srcset)="([^"]+)"|"(assets\/[^"]+)"/g)) {
  const value = m[2] || m[3];
  for (const part of m[1] === "srcset" ? value.split(",") : [value]) {
    const url = part.trim().split(/\s+/)[0];
    if (!url || /^(https?:|#|data:|mailto:)/.test(url) || url.includes("…")) continue;
    refs.add(url);
  }
}
for (const r of refs) {
  if (r.startsWith("/")) { failed++; console.error("FAIL absolute path (breaks on GitHub Pages)  " + r); continue; }
  if (existsSync(join(root, r))) console.log("ok   asset   " + r);
  else { failed++; console.error("FAIL missing  " + r); }
}

if (failed) { console.error(`\n${failed} problem(s) found.`); process.exit(1); }
console.log("\nAll checks passed.");
