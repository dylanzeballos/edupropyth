/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'
import { vi, beforeAll } from 'vitest'
import 'whatwg-fetch'

// -------------------------------
// Polyfills DOM comunes en jsdom
// -------------------------------
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      ...globalThis.crypto,
      randomUUID: vi.fn(() => '00000000-0000-4000-8000-000000000000'),
    },
    writable: true,
  })
}

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
  takeRecords: vi.fn(() => []),
})) as any

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
})) as any

// -------------------------------
// Mocks de módulos "ruidosos"
// -------------------------------

// Evita dependencias reales de Google OAuth en test
vi.mock('@react-oauth/google', () => {
  return {
    GoogleOAuthProvider: (({ children }: any) => children),
    // otros exports si los usas...
  }
})

// Evita navegación forzada en tests de integración básicos
vi.mock('@/features/auth/components/ProtectedRoutes', () => {
  return {
    ProtectedRoutes: ({ children }: any) => children,
  }
})

vi.mock('@/features/auth/components/PublicOnlyRoutes', () => {
  return {
    PublicOnlyRoutes: ({ children }: any) => children,
  }
})

// RoleGuard que solo deja pasar
vi.mock('@/features/auth', async (importOriginal) => {
  const mod = await importOriginal<any>()
  return {
    ...mod,
    RoleGuard: ({ children }: any) => children,
  }
})

// Hook que no haga side-effects (peticiones, listeners, etc.)
vi.mock('@/features/auth/hooks/use-auth-check', () => {
  return {
    useAuthCheck: () => {},
  }
})

// Evitar peticiones reales por defecto si algo usa apiClient
vi.mock('@/lib/api', () => {
  const axiosLike = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  }
  return { apiClient: axiosLike }
})

// Limpieza de DOM
beforeAll(() => {
  document.body.innerHTML = ''
})
