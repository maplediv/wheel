import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
import { join } from 'path';

export default defineConfig({
  plugins: [
    react(), // Use the React plugin
    replace({
      'preventAssignment': true, // Add preventAssignment option
      'process.env.VITE_REACT_APP_GOOGLE_VISION_API_KEY': JSON.stringify(process.env.VITE_REACT_APP_GOOGLE_VISION_API_KEY || ''),
    }),
  ],
  server: {
    port: 3000, // Specify the port number
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist', // Specify the output directory
  },
  resolve: {
    alias: {
      '/@env/': join(__dirname, '.env'),
    },
  },
});
