import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// O GitHub Pages publica a pasta docs/ da branch main — o build vai direto para lá.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ["react", "react-dom"] },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "motion/react", "@react-three/fiber", "three", "lucide-react", "gsap", "gsap/ScrollTrigger", "@gsap/react"],
  },
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    // A cena 3D (three + R3F) é importada via lazy() e vira um chunk próprio, carregado sob demanda.
    chunkSizeWarningLimit: 1000,
  },
});
