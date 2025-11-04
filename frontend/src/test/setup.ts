/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { vi, beforeAll } from 'vitest';
import 'whatwg-fetch';
import React from 'react';

// ✅ MOCK COMPLETO DE FRAMER MOTION - SOLUCIÓN DEFINITIVA
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    section: ({ children, ...props }: any) => React.createElement('section', props, children),
    main: ({ children, ...props }: any) => React.createElement('main', props, children),
    header: ({ children, ...props }: any) => React.createElement('header', props, children),
    footer: ({ children, ...props }: any) => React.createElement('footer', props, children),
    nav: ({ children, ...props }: any) => React.createElement('nav', props, children),
    form: ({ children, ...props }: any) => React.createElement('form', props, children),
    input: ({ children, ...props }: any) => React.createElement('input', props, children),
    label: ({ children, ...props }: any) => React.createElement('label', props, children),
    p: ({ children, ...props }: any) => React.createElement('p', props, children),
    h1: ({ children, ...props }: any) => React.createElement('h1', props, children),
    h2: ({ children, ...props }: any) => React.createElement('h2', props, children),
    h3: ({ children, ...props }: any) => React.createElement('h3', props, children),
    h4: ({ children, ...props }: any) => React.createElement('h4', props, children),
    h5: ({ children, ...props }: any) => React.createElement('h5', props, children),
    h6: ({ children, ...props }: any) => React.createElement('h6', props, children),
    ul: ({ children, ...props }: any) => React.createElement('ul', props, children),
    ol: ({ children, ...props }: any) => React.createElement('ol', props, children),
    li: ({ children, ...props }: any) => React.createElement('li', props, children),
    a: ({ children, ...props }: any) => React.createElement('a', props, children),
    img: ({ children, ...props }: any) => React.createElement('img', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollY: { current: 0 } }),
  useTransform: () => 0,
  useSpring: () => ({ current: 0 }),
  useMotionValue: () => ({ current: 0 }),
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
  }),
}));

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
});

if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      ...globalThis.crypto,
      randomUUID: vi.fn(() => '00000000-0000-4000-8000-000000000000'),
    },
    writable: true,
  });
}

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
  takeRecords: vi.fn(() => []),
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// -------------------------------
// Mocks de módulos "ruidosos" - DE TU VERSIÓN ORIGINAL
// -------------------------------

// Evita dependencias reales de Google OAuth en test
vi.mock('@react-oauth/google', () => {
  return {
    GoogleOAuthProvider: (({ children }: any) => children),
    // otros exports si los usas...
  };
});

// Evita navegación forzada en tests de integración básicos
vi.mock('@/features/auth/components/ProtectedRoutes', () => {
  return {
    ProtectedRoutes: ({ children }: any) => children,
  };
});

vi.mock('@/features/auth/components/PublicOnlyRoutes', () => {
  return {
    PublicOnlyRoutes: ({ children }: any) => children,
  };
});

// RoleGuard que solo deja pasar
vi.mock('@/features/auth', async (importOriginal) => {
  const mod = await importOriginal<any>();
  return {
    ...mod,
    RoleGuard: ({ children }: any) => children,
  };
});

// Hook que no haga side-effects (peticiones, listeners, etc.)
vi.mock('@/features/auth/hooks/use-auth-check', () => {
  return {
    useAuthCheck: () => {},
  };
});

// Evitar peticiones reales por defecto si algo usa apiClient
vi.mock('@/lib/api', () => {
  const axiosLike = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  };
  return { apiClient: axiosLike };
});

// Limpieza de DOM
beforeAll(() => {
  document.body.innerHTML = '';
});