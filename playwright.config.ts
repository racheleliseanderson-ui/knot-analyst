import { defineConfig, devices } from "@playwright/test";

/**
 * Production-like e2e: the app is built and served by the same worker runtime
 * the deployed site uses (nitro cloudflare output via wrangler), not vite dev.
 */
const PORT = Number(process.env['E2E_PORT'] ?? 8788);
const baseURL = process.env['E2E_BASE_URL'] ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: process.env['CI'] ? [["github"], ["list"]] : [["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    // Local sandboxes can point at a system Chromium; CI uses Playwright's own.
    ...(process.env['E2E_CHROMIUM']
      ? { launchOptions: { executablePath: process.env['E2E_CHROMIUM'] } }
      : {}),
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  ...(process.env['E2E_BASE_URL']
    ? {}
    : {
        webServer: {
          command: `bun run e2e:serve -- --port ${PORT}`,
          url: baseURL,
          reuseExistingServer: !process.env['CI'],
          timeout: 180_000,
          stdout: "pipe",
          stderr: "pipe",
        },
      }),
});
