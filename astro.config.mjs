import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import clerk from '@clerk/astro';

import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [
    tailwind(), 
    clerk()
  ],

  output: 'server',
  adapter: netlify()
});