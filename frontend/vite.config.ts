import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
      allowedHosts: ["e2216a84684f.ngrok-free.app", "5173"]
    }
})
