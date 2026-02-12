import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("react-router-dom")) {
            return "vendor-router";
          }

          if (id.includes("@tanstack/react-query")) {
            return "vendor-query";
          }

          if (id.includes("react-leaflet") || id.includes("leaflet")) {
            return "vendor-map";
          }

          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }

          return "vendor-core";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
