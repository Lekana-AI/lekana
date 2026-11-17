#!/usr/bin/env node
/**
 * One-click deploy of every Lekana service as its own Vercel project.
 *
 *   VERCEL_TOKEN=... node scripts/deploy-vercel.mjs [options]
 *
 * For each service in deploy/services.json it:
 *   1. creates (or reuses) a Git-connected Vercel project,
 *   2. pushes its env vars from deploy/vercel.env (or $LEKANA_VERCEL_ENV),
 *      plus the production URLs of the services it links to,
 *   3. triggers a production deployment and waits for it.
 * Services are deployed in dependency order; independent ones in parallel.
 *
 * Options
 *   --source root|services  root (default): every project builds from THIS repo,
 *                           Root Directory = the submodule folder.
 *                           services: each project builds from the service's own repo.
 *   --repo owner/name       root repo on GitHub (default: $GITHUB_REPOSITORY or git origin)
 *   --ref branch            git ref to deploy (default: $GITHUB_REF_NAME or main)
 *   --only a,b              only deploy these service ids (links still resolve)
 *   --env path              env file (default: deploy/vercel.env)
 *   --dry-run               print the plan, change nothing
 *
 * Env: VERCEL_TOKEN (required), VERCEL_TEAM_ID (optional; team scope),
 *      LEKANA_VERCEL_ENV (optional; env-file *contents*, used in CI).
 *
 * Requires Node 18+. No dependencies.
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.vercel.com";

// ---------------------------------------------------------------- args
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = args[i + 1];
  return v && !v.startsWith("--") ? v : true;
};
const SOURCE = flag("source", "root");
const DRY = flag("dry-run", false) === true;
const REF = flag("ref", process.env.GITHUB_REF_NAME || "main");
const ONLY = flag("only") ? String(flag("only")).split(",").map((s) => s.trim()) : null;
const ENV_PATH = flag("env", join(ROOT, "deploy", "vercel.env"));
const TOKEN = process.env.VERCEL_TOKEN;
const TEAM = process.env.VERCEL_TEAM_ID;

if (!["root", "services"].includes(SOURCE)) die(`--source must be "root" or "services"`);
if (!TOKEN && !DRY) die("VERCEL_TOKEN is not set. Create one at https://vercel.com/account/tokens");

const ROOT_REPO = flag("repo", process.env.GITHUB_REPOSITORY || originRepo());
if (SOURCE === "root" && !ROOT_REPO) die("Could not work out the root GitHub repo. Pass --repo owner/name.");

const { services } = JSON.parse(readFileSync(join(ROOT, "deploy", "services.json"), "utf8"));
const byId = Object.fromEntries(services.map((s) => [s.id, s]));
if (ONLY) for (const id of ONLY) if (!byId[id]) die(`Unknown service id "${id}". Known: ${Object.keys(byId).join(", ")}`);

const envFile = parseEnvFile(
  process.env.LEKANA_VERCEL_ENV ?? (existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : ""),
);

// ---------------------------------------------------------------- main
const urls = {}; // service id -> https://production-domain
const results = [];

main().catch((err) => die(err.stack || String(err)));

async function main() {
  log(`Source: ${SOURCE === "root" ? `${ROOT_REPO}@${REF} (submodules)` : "per-service repos"}${DRY ? "  [dry run]" : ""}`);

  for (const level of dependencyLevels(services)) {
    await Promise.all(
      level.map(async (svc) => {
        const selected = !ONLY || ONLY.includes(svc.id);
        try {
          if (selected) await deployService(svc);
          else if (!DRY) urls[svc.id] = await existingUrl(svc);
        } catch (err) {
          results.push({ id: svc.id, project: svc.project, state: "FAILED", error: err.message });
          log(`✗ ${svc.id}: ${err.message}`);
        }
      }),
    );
    // Don't deploy dependents against a failed dependency.
    if (results.some((r) => r.state === "FAILED")) break;
  }

  report();
  if (results.some((r) => r.state !== "READY" && r.state !== "PLANNED")) process.exit(1);
}

async function deployService(svc) {
  const env = resolveEnv(svc);
  const missing = (svc.required || []).filter((k) => !env[k]);
  if (missing.length) log(`! ${svc.id}: missing ${missing.join(", ")} (deploying anyway; set them in deploy/vercel.env)`);

  const gitRepo = SOURCE === "root" ? ROOT_REPO : svc.repo;
  const rootDirectory = SOURCE === "root" ? svc.path : null;
  const ref = SOURCE === "root" ? REF : "main";

  if (DRY) {
    log(`• ${svc.id} → project "${svc.project}" from ${gitRepo}${rootDirectory ? `/${rootDirectory}` : ""}@${ref}`);
    log(`    env: ${Object.keys(env).join(", ") || "(none)"}`);
    urls[svc.id] = `https://${svc.project}.vercel.app`;
    results.push({ id: svc.id, project: svc.project, state: "PLANNED", url: urls[svc.id] });
    return;
  }

  const project = await ensureProject(svc, gitRepo, rootDirectory);
  await upsertEnv(project.id, env);

  log(`… ${svc.id}: deploying ${gitRepo}@${ref}`);
  const dep = await vercel("POST", "/v13/deployments", {
    query: { forceNew: "1", skipAutoDetectionConfirmation: "1" },
    body: {
      name: svc.project,
      project: project.id,
      target: "production",
      gitSource: project.link?.repoId
        ? { type: "github", repoId: project.link.repoId, ref }
        : { type: "github", org: gitRepo.split("/")[0], repo: gitRepo.split("/")[1], ref },
    },
  });

  const final = await waitForDeployment(dep.id, svc.id);
  if (final.readyState !== "READY") {
    throw new Error(`deployment ${final.readyState} — build logs: ${final.inspectorUrl || dep.inspectorUrl || dep.id}`);
  }
  urls[svc.id] = (await existingUrl(svc, project.id)) || `https://${final.url}`;
  results.push({ id: svc.id, project: svc.project, state: "READY", url: urls[svc.id] });
  log(`✓ ${svc.id}: ${urls[svc.id]}`);
}

// ---------------------------------------------------------------- vercel helpers
async function ensureProject(svc, gitRepo, rootDirectory) {
  let project = await vercel("GET", `/v9/projects/${svc.project}`, { allow404: true });
  if (!project) {
    log(`+ ${svc.id}: creating project "${svc.project}"`);
    project = await vercel("POST", "/v11/projects", {
      body: {
        name: svc.project,
        framework: null, // services pin this in vercel.json; the web app's SvelteKit adapter emits Build Output API
        rootDirectory,
        gitRepository: { type: "github", repo: gitRepo },
      },
    }).catch((err) => {
      if (/repository|git|install/i.test(err.message)) {
        err.message += `\n   → Install the Vercel GitHub app on ${gitRepo.split("/")[0]} with access to ${gitRepo}: https://github.com/apps/vercel`;
      }
      throw err;
    });
  } else if ((project.rootDirectory || null) !== rootDirectory) {
    project = await vercel("PATCH", `/v9/projects/${project.id}`, { body: { rootDirectory } });
  }
  return project;
}

async function upsertEnv(projectId, env) {
  const entries = Object.entries(env);
  if (!entries.length) return;
  await vercel("POST", `/v10/projects/${projectId}/env`, {
    query: { upsert: "true" },
    body: entries.map(([key, value]) => ({ key, value, type: "encrypted", target: ["production", "preview"] })),
  });
}

async function waitForDeployment(id, label) {
  const started = Date.now();
  for (;;) {
    const d = await vercel("GET", `/v13/deployments/${id}`);
    if (["READY", "ERROR", "CANCELED"].includes(d.readyState)) return d;
    if (Date.now() - started > 25 * 60_000) throw new Error("timed out waiting for deployment");
    await new Promise((r) => setTimeout(r, 5000));
    if ((Date.now() - started) % 60_000 < 5000) log(`… ${label}: ${d.readyState}`);
  }
}

async function existingUrl(svc, projectId = svc.project) {
  const res = await vercel("GET", `/v9/projects/${projectId}/domains`, { allow404: true });
  const domains = (res?.domains || []).filter((d) => !d.redirect && d.verified !== false);
  const custom = domains.find((d) => !d.name.endsWith(".vercel.app"));
  const pick = custom || domains[0];
  return pick ? `https://${pick.name}` : null;
}

async function vercel(method, path, { body, query = {}, allow404 = false } = {}) {
  const url = new URL(API + path);
  if (TEAM) url.searchParams.set("teamId", TEAM);
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (allow404 && res.status === 404) return null;
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${data.error?.message || text}`);
  return data;
}

// ---------------------------------------------------------------- env + ordering
function resolveEnv(svc) {
  const env = {};
  for (const key of svc.env || []) {
    const v = envFile[svc.id]?.[key] ?? envFile.shared?.[key];
    if (v) env[key] = v;
  }
  for (const [key, target] of Object.entries(svc.links || {})) {
    if (urls[target]) env[key] = urls[target];
    else log(`! ${svc.id}: ${key} left unset, "${target}" has no production URL yet`);
  }
  return env;
}

function dependencyLevels(list) {
  const done = new Set();
  const levels = [];
  let rest = [...list];
  while (rest.length) {
    const level = rest.filter((s) => Object.values(s.links || {}).every((t) => done.has(t)));
    if (!level.length) die(`Circular links between: ${rest.map((s) => s.id).join(", ")}`);
    level.forEach((s) => done.add(s.id));
    levels.push(level);
    rest = rest.filter((s) => !done.has(s.id));
  }
  return levels;
}

function parseEnvFile(text) {
  const out = {};
  let section = "shared";
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const sec = line.match(/^\[([\w-]+)\]$/);
    if (sec) { section = sec[1]; continue; }
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2];
    if (/^'.*'$|^".*"$/.test(value)) value = value.slice(1, -1);
    (out[section] ||= {})[m[1]] = value;
  }
  return out;
}

// ---------------------------------------------------------------- misc
function originRepo() {
  try {
    const url = execSync("git remote get-url origin", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    return url.match(/github\.com[:/](.+?\/.+?)(\.git)?$/)?.[1] || null;
  } catch {
    return null;
  }
}

function report() {
  const rows = services.map((s) => results.find((r) => r.id === s.id) || { id: s.id, project: s.project, state: "SKIPPED" });
  const pad = (s, n) => String(s ?? "").padEnd(n);
  console.log("\n" + pad("service", 20) + pad("state", 9) + "url / error");
  for (const r of rows) console.log(pad(r.id, 20) + pad(r.state, 9) + (r.url || r.error || ""));

  const actionUrls = ["ocr", "classification", "conditional-router", "db-export", "upload"]
    .filter((id) => urls[id]).map((id) => `  ${id.padEnd(20)}${urls[id]}`);
  if (actionUrls.length) {
    console.log("\nWorkflow actions call these services through Action.serviceUrl in the workflow-builder DB.");
    console.log("Point each action at its URL (append the action's path, e.g. /api/v1/process):\n" + actionUrls.join("\n"));
  }

  if (!DRY) writeFileSync(join(ROOT, "deploy", "last-deploy.json"), JSON.stringify({ at: new Date().toISOString(), source: SOURCE, results: rows }, null, 2));
  if (process.env.GITHUB_STEP_SUMMARY) {
    const md = ["| service | state | url |", "|---|---|---|", ...rows.map((r) => `| ${r.id} | ${r.state} | ${r.url || r.error || ""} |`)];
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, md.join("\n") + "\n");
  }
}

function log(msg) {
  console.log(msg);
}

function die(msg) {
  console.error(`deploy-vercel: ${msg}`);
  process.exit(1);
}
