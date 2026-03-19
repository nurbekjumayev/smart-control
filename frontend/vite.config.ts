import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isGitHubPages = mode === 'production' && !(globalThis as any).process?.env?.VERCEL;
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    base: isGitHubPages ? '/smart-control/' : '/',
  }
})
