import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 1. **DEFINE YOUR REPOSITORY NAME HERE**
// This MUST match the name of your GitHub repository exactly.
const REPO_NAME = 'Chant_'; // <--- **REPLACE THIS**

// https://vitejs.dev/config/
export default defineConfig({
  // 2. **ADD THE base PROPERTY**
  // This tells Vite to use '/my-github-repo-name/' as the base path for all assets.
  base: `/${REPO_NAME}/`,
  plugins: [react()],
});
