import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const envDir = fileURLToPath(new URL('..', import.meta.url))

function required(env: Record<string, string>, name: string): string {
  const value = process.env[name] || env[name]
  if (!value?.trim()) throw new Error(`Variável de ambiente obrigatória não configurada: ${name}`)
  return value.trim()
}

function integer(env: Record<string, string>, name: string): number {
  const value = Number.parseInt(required(env, name), 10)
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Variável de ambiente inválida: ${name}`)
  }
  return value
}

export default defineConfig(({ mode }) => {
  const loaded = loadEnv(mode, envDir, '')
  const apiBasePath = required(loaded, 'APP_API_BASE_PATH')

  return {
    envDir,
    envPrefix: ['VITE_', 'APP_', 'BOOK_', 'UI_', 'SUPER_ADMIN_EMAIL'],
    plugins: [react()],
    server: {
      port: integer(loaded, 'FRONTEND_PORT'),
      proxy: {
        [apiBasePath]: `${required(loaded, 'DEV_PROTOCOL')}://${required(loaded, 'DEV_HOST')}:${integer(loaded, 'PORT')}`
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  }
})
