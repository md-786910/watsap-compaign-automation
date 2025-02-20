import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./",
  plugins: [react()],
  publicDir: "public",
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@headlessui/react",
      "@heroicons/react",
      "clsx",
      "lodash-es",
    ],
    exclude: ["lucide-react"],
  },
  build: {
    target: "esnext",
    cssCodeSplit: true,
    minify: "esbuild",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("lucide-react")) return "lucide-react";
            if (id.includes("@heroicons/react")) return "heroicons";
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    host: true,
    // port: 3000,
    strictPort: true,
    open: false,
  },
});
