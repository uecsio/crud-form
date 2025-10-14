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
        '@formkit/core',
        '@formkit/vue',
        '@formkit/i18n',
        '@coreui/vue',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
        'vue-i18n',
        'vue-router'
      ],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@formkit/core': 'FormKitCore',
          '@formkit/vue': 'FormKitVue',
          '@formkit/i18n': 'FormKitI18n',
          '@coreui/vue': 'CoreUIVue',
          '@fortawesome/fontawesome-svg-core': 'FontAwesomeCore',
          '@fortawesome/free-solid-svg-icons': 'FontAwesomeSolid',
          '@fortawesome/vue-fontawesome': 'FontAwesomeVue',
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
