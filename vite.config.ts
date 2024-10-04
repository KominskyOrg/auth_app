import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    base: "/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      proxy:
        mode === "development"
          ? {
              "/api": {
                target: env.AUTH_API_URL || "http://auth_api:5000",
                changeOrigin: true,
                secure: false,
                ws: true,
              },
            }
          : {},
    },
    build: {
      outDir: "dist",
    },
    define: {
      __DEFINES__: {
        __DEV__: mode === "development",
        __STAGING__: mode === "staging",
        __PRODUCTION__: mode === "production",
      },
    },
  });
};
