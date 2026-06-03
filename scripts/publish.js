#!/usr/bin/env node
/**
 * `npm run publish` — content author workflow.
 *
 * 1. Shows what has changed since the last push.
 * 2. Asks for a one-line commit message (default falls back to a generic
 *    "Content update <ISO date>").
 * 3. Stages everything, commits, pushes to `origin/<current branch>`.
 *
 * Vercel (or whatever host is wired to the GitHub repo) picks the push up
 * and rebuilds the live site.
 *
 * Safe by design:
 *   - aborts if there are no changes
 *   - aborts if the user is on a detached HEAD
 *   - never force-pushes
 *   - never bypasses hooks
 */

const { execSync, spawnSync } = require("node:child_process");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], ...opts }).trim();
}

function shInherit(cmd) {
  const [bin, ...args] = cmd.split(" ");
  return spawnSync(bin, args, { stdio: "inherit" });
}

function fail(msg, code = 1) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(code);
}

async function main() {
  // Sanity: inside a git repo
  try {
    sh("git rev-parse --is-inside-work-tree");
  } catch {
    fail("Not inside a git repo. Run this from the frnd-docs root.");
  }

  // Branch
  let branch;
  try {
    branch = sh("git symbolic-ref --short HEAD");
  } catch {
    fail("Detached HEAD — please checkout a branch first (`git switch main`).");
  }

  // Changes?
  const status = sh("git status --porcelain");
  if (!status) {
    console.log("\n✓ Nothing to publish — working tree is clean.\n");
    return;
  }

  // Show what will be committed
  console.log(`\n📝 Changes that will be published to origin/${branch}:\n`);
  shInherit("git status --short");
  console.log("");

  // Prompt for commit message
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const defaultMsg = `Content update ${new Date().toISOString().slice(0, 10)}`;
  let msg = (await rl.question(`Commit message (Enter for "${defaultMsg}"): `)).trim();
  rl.close();
  if (!msg) msg = defaultMsg;

  // Stage + commit + push
  console.log("\n→ Staging all changes...");
  shInherit("git add -A");

  console.log("→ Committing...");
  const commit = spawnSync("git", ["commit", "-m", msg], { stdio: "inherit" });
  if (commit.status !== 0) fail("Commit failed — see error above.", commit.status || 1);

  console.log(`→ Pushing to origin/${branch}...`);
  const push = spawnSync("git", ["push", "origin", branch], { stdio: "inherit" });
  if (push.status !== 0) fail("Push failed — see error above.", push.status || 1);

  console.log(`\n✅ Published to origin/${branch}. Vercel will redeploy automatically.\n`);
}

main().catch((err) => fail(err.message || String(err)));
