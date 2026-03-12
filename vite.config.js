import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.spec.ts', '**/*.test.ts', '**/examples/**']
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'CrudForm',
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        'vue',
        '@kevinkosterr/vue3-form-generator',
        '@uecsio/api-client',
        'vue-i18n',
        'vue-router'
      ],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@kevinkosterr/vue3-form-generator': 'VueFormGenerator',
          '@uecsio/api-client': 'ApiClient',
          'vue-i18n': 'VueI18n',
          'vue-router': 'VueRouter'
        }
      }
    },
    sourcemap: true,
    minify: 'terser'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
