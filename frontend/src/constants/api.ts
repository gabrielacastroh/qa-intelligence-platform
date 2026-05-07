/**
 * Vite sustituye `import.meta.env.VITE_*` en tiempo de build (no en runtime en el navegador).
 * En Vercel: define `VITE_API_URL` en Settings → Environment Variables y vuelve a desplegar
 * para que el bundle se regenere con el valor (Preview y Production pueden tener valores distintos).
 */
const rawViteApiUrl = import.meta.env.VITE_API_URL as string | undefined

console.log('API URL:', import.meta.env.VITE_API_URL)

const DEV_DEFAULT = 'http://127.0.0.1:8000'

function normalizeBaseUrl(): string {
  const trimmed = rawViteApiUrl?.trim()

  if (!trimmed) {
    if (import.meta.env.DEV) {
      console.warn(
        `[api] VITE_API_URL está vacía; usando ${DEV_DEFAULT}. En producción, configúrala en el hosting y redeploy.`,
      )
      return stripTrailingSlash(DEV_DEFAULT)
    }
    console.error(
      '[api] VITE_API_URL está vacía en el build. Añádela en Vercel (u otro CI) y haz un deployment nuevo; elige el scope correcto (Production / Preview).',
    )
    return ''
  }

  // Sin esquema el navegador resuelve como ruta relativa al origen del sitio → ej. .../VITE_API_URL/run-test
  if (!/^https?:\/\//i.test(trimmed)) {
    const hint =
      'Debe ser una URL absoluta (https://tu-api.example.com), sin comillas ni solo una ruta.'
    if (import.meta.env.DEV) {
      console.warn(
        `[api] VITE_API_URL no es una URL absoluta válida (${hint}). Valor: "${trimmed}". Usando ${DEV_DEFAULT}.`,
      )
      return stripTrailingSlash(DEV_DEFAULT)
    }
    console.error(
      `[api] VITE_API_URL debe empezar por http:// o https://. ${hint} Valor: "${trimmed}". Corrige y redeploy.`,
    )
    return ''
  }

  return stripTrailingSlash(trimmed)
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '')
}

export const API_BASE_URL = normalizeBaseUrl()
