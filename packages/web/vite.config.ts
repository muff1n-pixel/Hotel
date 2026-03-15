import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      $assets: path.resolve(__dirname, "../../assets")
    }
  },
  server: {
    host: true,
    fs: {
      allow: [path.resolve(__dirname, "../../assets")]
    }
  },
  build: {
    outDir: path.resolve(__dirname, "../../build/web"),
    emptyOutDir: true
  }
});