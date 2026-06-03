import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In Electron the app is loaded from the filesystem, so assets must use
// relative paths. base: "./" makes the production build work via file://.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
