import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "url";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "happy-dom",
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/core/index.ts"),
      name: "CacheQuery",
      fileName: "index",
    },
    outDir: "dist",
  }
});
