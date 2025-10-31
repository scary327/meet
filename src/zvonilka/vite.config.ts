import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      {
        find: "@app",
        replacement: path.resolve(__dirname, "src/app"),
      },
      {
        find: "@shared",
        replacement: path.resolve(__dirname, "src/shared"),
      },
      {
        find: "@pages",
        replacement: path.resolve(__dirname, "src/app/pages"),
      },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
    ],
  },
});
