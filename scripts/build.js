#!/usr/bin/env node
/**
 * Smart build wrapper.
 *
 * - If TinaCloud creds are present in env (`NEXT_PUBLIC_TINA_CLIENT_ID` + `TINA_TOKEN`),
 *   run `build:cloud` — TinaCMS admin will be backed by TinaCloud in production.
 * - Otherwise, run `build:local` — admin is built but not functional in production
 *   (read-only / dev-only editing pattern).
 *
 * This is what Vercel ends up invoking via `npm run build`.
 */

const { spawnSync } = require("node:child_process");

const hasCloudCreds = !!(
  process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN
);
const target = hasCloudCreds ? "build:cloud" : "build:local";

console.log(
  `\n→ Tina creds ${hasCloudCreds ? "found" : "MISSING"} — running \`npm run ${target}\`\n`,
);

const result = spawnSync("npm", ["run", target], { stdio: "inherit" });
process.exit(result.status || 0);
