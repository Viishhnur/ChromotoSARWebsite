import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// this file is used to configure the frontend
export default defineConfig({
  base: 'frontend/' , // Use relative paths for assets
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})

