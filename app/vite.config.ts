import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const missionsPublicDir = path.resolve(__dirname, '../../ootp-missions-27/app/public')

const EXT_CONTENT_TYPES: Record<string, string> = {
  '.csv': 'text/csv',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'serve-missions-27-static',
      configureServer(server) {
        server.middlewares.use('/ootp-missions-27', (req, res, next) => {
          const filePath = path.join(missionsPublicDir, req.url || '/')
          try {
            if (fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase()
              res.setHeader('Content-Type', EXT_CONTENT_TYPES[ext] ?? 'application/octet-stream')
              res.statusCode = 200
              fs.createReadStream(filePath).pipe(res)
              return
            }
          } catch {}
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/ootp-pack-sampler/',
  server: {
    port: 5174,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
