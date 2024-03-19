import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
import { join } from 'path';

export default defineConfig({
  plugins: [
    react(), // Use the React plugin
    replace({
      'process.env.REACT_APP_API_KEY': JSON.stringify(process.env.REACT_APP_API_KEY || ''),
    }),
  ],
  build: {
    outDir: 'dist', // Specify the output directory
  },
  resolve: {
    alias: {
      '/@env/': join(__dirname, '.env'),
    },
  },
});
