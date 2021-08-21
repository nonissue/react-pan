import { defineConfig, ConfigEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig((_configEnv: ConfigEnv) => {
  return {
    server: {
      port: 3000,
      // https: true,
      strictPort: true,
      hmr: {
        // host: "localhost",
        port: 443,
        protocol: "wss"
      }
    },
    base: "./",
    plugins: [reactRefresh()]
  };
});
