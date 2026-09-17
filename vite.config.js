import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// See https://vitejs.dev/config/build-options.html#build-base
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/sandbox-workspace/",
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
