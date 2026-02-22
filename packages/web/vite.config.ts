import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  build: {
    outDir: path.resolve(__dirname, "../../build/web"),
    emptyOutDir: true
  }
});