import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { autoReportPlugin } from "@timotte-sdk/auto-report";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), autoReportPlugin()],
  optimizeDeps: {
    include: [
      "@timotte-sdk/browser",
      "@timotte-sdk/page-crash-worker",
      "@timotte-sdk/user-behavior",
      "@timotte-sdk/auto-report",
    ],
  },
});
