// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from '@nuxt/types'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const { NODE_ENV } = process.env

const config: NuxtConfig = {
  ssr: false,
  
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/images/favicon.ico' }]
    }
  },

  // Variabes to access on runtime for nuxt backend and public in browser
  runtimeConfig: {
    public: { }
  },

  // import styles
  css: ['@/assets/main.scss', '@/assets/variables.scss'],
  //...
  build: {
    transpile: ['vuetify'],
  },
  buildModules: ['@nuxt/typescript-build'],

  modules: [
    '@pinia/nuxt',
    // @ts-ignore
    (_options, nuxt) => {
      return nuxt.hooks.hook('vite:extendConfig', (config: any) => {
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],

  pinia: {
    storesDirs: ['./stores/**'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  // https://nitro.unjs.io/guide/routing#route-rules
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  imports: {
    autoImport: true,
    dirs: [
      // scan all modules within given directory
      'composables/**',
      './types/*.ts',
      './types/**/*.ts'
    ]
  },

  devtools: {
    enabled: NODE_ENV !== 'production',
  },
}

export default config