#!/usr/bin/env node
/**
 * Serve the nitro cloudflare-module build for Playwright.
 *
 * Nitro stamps compatibility_date as "today"; wrangler 4's workerd binary
 * often only accepts through yesterday. Nested routes also 404 unless the
 * worker runs before the static-asset handler.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";

const configPath = ".output/server/wrangler.json";
const config = JSON.parse(readFileSync(configPath, "utf8"));
config.compatibility_date = "2026-08-18";
if (config.assets && typeof config.assets === "object") {
  config.assets.run_worker_first = true;
}
writeFileSync(configPath, JSON.stringify(config, null, 2));

const child = spawn(
  "wrangler",
  ["dev", "-c", configPath, "--ip", "127.0.0.1", ...process.argv.slice(2)],
  { stdio: "inherit" },
);
child.on("exit", (code) => process.exit(code ?? 1));
