import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Keep the single platform coordinator inline; retain Vite's default for
      // every other asset and reject growth beyond this bounded entry budget.
      assetsInlineLimit(filePath, content) {
        if (
          filePath.includes('SiteLayout.astro_astro_type_script_index_0_lang.')
        )
          return content.byteLength <= 5 * 1024;
      },
    },
  },
});
