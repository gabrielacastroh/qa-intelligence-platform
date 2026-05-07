import { API_BASE_URL } from '../constants/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'

export type JsonInit = Omit<RequestInit, 'body' | 'method'> & {
  body?: unknown
}

function joinUrl(path: string): string {
  if (path.startsWith('http')) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

function buildBodyInit(body: unknown, headers: Headers): BodyInit | undefined {
  if (body === undefined || body === null) return undefined
  if (
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer
  ) {
    return body as BodyInit
  }
  if (typeof body === 'string') return body
  headers.set('Content-Type', 'application/json')
  return JSON.stringify(body)
}

async function parseErrorMessage(response: Response): Promise<string> {
  const text = await response.text()
  try {
    const parsed = JSON.parse(text) as { detail?: unknown }
    if (typeof parsed.detail === 'string') return parsed.detail
    if (Array.isArray(parsed.detail)) {
      const first = parsed.detail[0] as { msg?: string } | undefined
      if (first?.msg) return first.msg
    }
  } catch {
    return text || response.statusText
  }
  return text || response.statusText
}

export async function fetchWithConfig(
  path: string,
  method: HttpMethod,
  init: JsonInit = {}
): Promise<Response> {
  const { body, headers: headerInit, ...rest } = init
  const headers = new Headers(headerInit)
  const sendsBody = method !== 'GET' && method !== 'HEAD'
  const bodyInit = sendsBody ? buildBodyInit(body, headers) : undefined

  return fetch(joinUrl(path), {
    ...rest,
    method,
    headers,
    body: bodyInit,
  })
}


export async function request(path: string, method: HttpMethod = 'GET', init: JsonInit = {}): Promise<Response> {
  const response = await fetchWithConfig(path, method, init)
  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response))
  }
  return response
}

export async function requestJson<T>(
  path: string,
  method: HttpMethod = 'GET',
  init: JsonInit = {}
): Promise<T> {
  const response = await request(path, method, init)

  if (method === 'HEAD' || response.status === 204) {
    return undefined as T
  }

  if (response.headers.get('content-length') === '0') {
    return undefined as T
  }

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return (await response.text()) as unknown as T
  }

  return response.json() as Promise<T>
}

export function getJson<T>(path: string, init?: JsonInit): Promise<T> {
  return requestJson<T>(path, 'GET', init)
}

export function postJson<T>(path: string, body?: unknown, init?: JsonInit): Promise<T> {
  return requestJson<T>(path, 'POST', { ...init, body })
}

export function putJson<T>(path: string, body?: unknown, init?: JsonInit): Promise<T> {
  return requestJson<T>(path, 'PUT', { ...init, body })
}

export function patchJson<T>(path: string, body?: unknown, init?: JsonInit): Promise<T> {
  return requestJson<T>(path, 'PATCH', { ...init, body })
}

export function deleteJson<T>(path: string, init?: JsonInit): Promise<T> {
  return requestJson<T>(path, 'DELETE', init)
}

export const apiClient = {
  request: requestJson,
  raw: request,
  fetch: fetchWithConfig,

  get: <T>(path: string, init?: JsonInit) => requestJson<T>(path, 'GET', init),
  post: <T>(path: string, body?: unknown, init?: JsonInit) =>
    requestJson<T>(path, 'POST', { ...init, body }),
  put: <T>(path: string, body?: unknown, init?: JsonInit) =>
    requestJson<T>(path, 'PUT', { ...init, body }),
  patch: <T>(path: string, body?: unknown, init?: JsonInit) =>
    requestJson<T>(path, 'PATCH', { ...init, body }),
  delete: <T>(path: string, init?: JsonInit) => requestJson<T>(path, 'DELETE', init),
  head: (path: string, init?: JsonInit) => request(path, 'HEAD', init),
} as const
