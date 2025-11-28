import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" }), tailwindcss()],
 server: {
    proxy: {
      '/api': {
        target: 'http://graduation-project1.runasp.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
