#!/usr/bin/env node
/**
 * Apply the "Protect main" ruleset (.github/rulesets/main.json) to the root
 * repo and every service repo listed in deploy/services.json.
 *
 *   GITHUB_TOKEN=... node scripts/apply-rulesets.mjs [--dry-run]
 *
 * Token: a fine-grained PAT for the org with "Administration: read & write"
 * on the repos, or a classic PAT with the `repo` scope. With the GitHub CLI
 * installed and logged in, `gh auth token` is used when GITHUB_TOKEN is unset.
 *
 * Re-running is safe: an existing ruleset with the same name is updated.
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry-run");
const ROOT_REPO = process.env.ROOT_REPO || "lekana-dev/lekana";

// GitHub Actions app: lets the root repo's "Update submodules" workflow push pointer bumps.
const ACTIONS_BYPASS = { actor_id: 15368, actor_type: "Integration", bypass_mode: "always" };

const base = JSON.parse(readFileSync(join(ROOT, ".github", "rulesets", "main.json"), "utf8"));
const { services } = JSON.parse(readFileSync(join(ROOT, "deploy", "services.json"), "utf8"));
const repos = [ROOT_REPO, ...services.map((s) => s.repo)];

const token = process.env.GITHUB_TOKEN || ghToken();
if (!token && !DRY) {
  console.error("Set GITHUB_TOKEN (or log in with `gh auth login`).");
  process.exit(1);
}

let failed = 0;
for (const repo of repos) {
  const ruleset = structuredClone(base);
  if (repo === ROOT_REPO) ruleset.bypass_actors.push(ACTIONS_BYPASS);

  if (DRY) {
    console.log(`• ${repo}: would apply "${ruleset.name}" (${ruleset.bypass_actors.length} bypass actors)`);
    continue;
  }
  try {
    const existing = (await gh("GET", `/repos/${repo}/rulesets?per_page=100`)).find((r) => r.name === ruleset.name);
    if (existing) await gh("PUT", `/repos/${repo}/rulesets/${existing.id}`, ruleset);
    else await gh("POST", `/repos/${repo}/rulesets`, ruleset);
    console.log(`✓ ${repo}: ${existing ? "updated" : "created"}`);
  } catch (err) {
    failed++;
    console.log(`✗ ${repo}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);

async function gh(method, path, body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    let msg = `${res.status} ${data.message || ""}`;
    if (data.errors) msg += ` ${JSON.stringify(data.errors)}`;
    if (res.status === 403 && /upgrade|public/i.test(msg)) msg += " → make the repo public (free plan only enforces rulesets on public repos)";
    if (res.status === 404) msg += " → token can't see this repo, or lacks Administration permission";
    throw new Error(msg);
  }
  return data;
}

function ghToken() {
  try {
    return execSync("gh auth token", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null;
  }
}
