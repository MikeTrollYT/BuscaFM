import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://buscafm.com', // Tu dominio propio
  base: '/',                  // Correcto, raíz porque es dominio propio
  output: 'static',           // Sitio estático
  build: {
    outDir: './dist',         // Carpeta de salida (por defecto es 'dist')
  },
});
