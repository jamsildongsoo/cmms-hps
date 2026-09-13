import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

let loaded = false
let environmentRoot = process.cwd()

/** backend 또는 repository root에서 실행해도 루트 .env 하나만 읽습니다. */
export function loadRootEnvironment(): void {
  if (loaded) return
  loaded = true

  const candidates = [resolve(process.cwd(), '.env'), resolve(process.cwd(), '..', '.env')]
  const envPath = candidates.find(existsSync)
  if (!envPath) return

  environmentRoot = resolve(envPath, '..')
  process.loadEnvFile(envPath)
}

function positiveInteger(name: string, fallback: number): number {
  const value = process.env[name]
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error(`${name} must be a positive integer`)
  return parsed
}

function commaSeparated(name: string, fallback: readonly string[]): string[] {
  loadRootEnvironment()
  const value = process.env[name]
  if (value === undefined) return [...fallback]
  const items = value.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
  if (items.length === 0) throw new Error(`${name} must contain at least one value`)
  return [...new Set(items)]
}

export function requiredEnvironment(name: string): string {
  loadRootEnvironment()
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required in the root .env file`)
  return value
}

export const environment = {
  database: () => ({
    host: requiredEnvironment('DB_HOST'),
    port: positiveInteger('DB_PORT', 5432),
    username: requiredEnvironment('DB_USERNAME'),
    password: requiredEnvironment('DB_PASSWORD'),
    database: requiredEnvironment('DB_NAME'),
  }),
  port: (): number => {
    loadRootEnvironment()
    return positiveInteger('PORT', 3000)
  },
  auth: () => ({
    jwtSecret: requiredEnvironment('AUTH_JWT_SECRET'),
    accessTokenTtlSeconds: positiveInteger('AUTH_ACCESS_TOKEN_TTL_SECONDS', 900),
    refreshTokenTtlSeconds: positiveInteger('AUTH_REFRESH_TOKEN_TTL_SECONDS', 1_209_600),
    failedLoginLimit: positiveInteger('AUTH_FAILED_LOGIN_LIMIT', 5),
    lockMinutes: positiveInteger('AUTH_LOCK_MINUTES', 30),
  }),
  fileStorage: () => {
    loadRootEnvironment()
    const driver = process.env.FILE_STORAGE_DRIVER?.trim() || 'local'
    const configuredPath = process.env.FILE_STORAGE_ROOT?.trim() || './storage'
    return {
      driver,
      rootPath: resolve(environmentRoot, configuredPath),
      maxSizeBytes: positiveInteger('FILE_MAX_SIZE_BYTES', 10 * 1024 * 1024),
      allowedContentTypes: commaSeparated('FILE_ALLOWED_CONTENT_TYPES', ['application/pdf', 'image/jpeg', 'image/png']),
      allowedExtensions: commaSeparated('FILE_ALLOWED_EXTENSIONS', ['pdf', 'jpg', 'jpeg', 'png']),
    }
  },
}
