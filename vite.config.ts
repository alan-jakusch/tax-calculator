import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { loadEnv, type PluginOption } from 'vite'

function toOrigin(urlValue: string | undefined): string | null {
  if (!urlValue) return null

  try {
    return new URL(urlValue).origin
  } catch {
    return null
  }
}

function createCsp(mode: string, apiBaseUrl: string | undefined): string {
  const apiOrigin = toOrigin(apiBaseUrl)
  const connectSources = new Set<string>(["'self'"])

  if (apiOrigin) {
    connectSources.add(apiOrigin)
  }

  if (mode !== 'production') {
    connectSources.add('http://localhost:*')
    connectSources.add('http://127.0.0.1:*')
    connectSources.add('ws://localhost:*')
    connectSources.add('ws://127.0.0.1:*')
  }

  // Vite dev injects CSS via inline <style>; Google Fonts use fonts.googleapis.com + fonts.gstatic.com
  const styleSources = ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com']
  const fontSources = ["'self'", 'data:', 'https://fonts.gstatic.com']

  return [
    "default-src 'self'",
    "script-src 'self'",
    `style-src ${styleSources.join(' ')}`,
    "img-src 'self' data:",
    `font-src ${fontSources.join(' ')}`,
    `connect-src ${Array.from(connectSources).join(' ')}`,
  ].join('; ')
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const cspContent = createCsp(mode, env.VITE_API_BASE_URL)

  const cspMetaPlugin: PluginOption = {
    name: 'inject-csp-meta',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: cspContent,
          },
          injectTo: 'head',
        },
      ]
    },
  }

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      cspMetaPlugin,
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
    },
  }
})
