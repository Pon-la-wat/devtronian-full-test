import { defineConfig } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? "4179");

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command: "npm run build && npm start",
    env: { PORT: String(port) },
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
