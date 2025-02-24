import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    allowedHosts: ["mask-off-server.vercel.app/"], // Add your CodeSandbox host
    host: "0.0.0.0", // Allows connections from external networks
    port: 5173, // Ensure this is your correct port
  },
});
