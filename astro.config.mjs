import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [
    tailwind(), 
    clerk()
  ],
  output: 'server'
});