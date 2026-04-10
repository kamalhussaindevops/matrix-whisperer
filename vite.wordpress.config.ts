import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "wordpress/wp-content/plugins/matrix-whisperer-pro/assets",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: "src/wordpress-main.tsx",
    },
  },
});
