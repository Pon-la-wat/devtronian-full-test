import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist", emptyOutDir: true },
  // `npm start`: the build, on the port the Platform gives (PORT).
  preview: {
    host: "127.0.0.1",
    port: Number(process.env.PORT ?? "4173"),
    strictPort: true,
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
