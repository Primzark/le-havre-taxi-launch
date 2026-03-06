import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function matchesPackage(id: string, packages: string[]) {
  return packages.some((pkg) => id.includes(`/node_modules/${pkg}/`));
}

function getVendorChunk(id: string) {
  const normalizedId = id.replace(/\\/g, "/");
  if (!normalizedId.includes("/node_modules/")) {
    return undefined;
  }

  if (matchesPackage(normalizedId, ["react-router-dom", "react-router", "@remix-run/router"])) {
    return "vendor-router";
  }

  if (matchesPackage(normalizedId, ["@tanstack/react-query"])) {
    return "vendor-query";
  }

  if (matchesPackage(normalizedId, ["react-leaflet", "@react-leaflet/core", "leaflet"])) {
    return "vendor-map";
  }

  if (matchesPackage(normalizedId, ["lucide-react"])) {
    return "vendor-icons";
  }

  if (matchesPackage(normalizedId, ["react", "react-dom", "scheduler"])) {
    return "vendor-react";
  }

  if (
    matchesPackage(normalizedId, [
      "@radix-ui",
      "cmdk",
      "embla-carousel-react",
      "input-otp",
      "next-themes",
      "react-day-picker",
      "react-resizable-panels",
      "sonner",
      "vaul",
    ])
  ) {
    return "vendor-ui";
  }

  if (
    matchesPackage(normalizedId, [
      "react-hook-form",
      "@hookform/resolvers",
      "zod",
      "date-fns",
    ])
  ) {
    return "vendor-form";
  }

  if (matchesPackage(normalizedId, ["framer-motion", "recharts"])) {
    return "vendor-visuals";
  }

  if (matchesPackage(normalizedId, ["@supabase", "bcryptjs"])) {
    return "vendor-data";
  }

  return "vendor-misc";
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return getVendorChunk(id);
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
