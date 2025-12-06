// src/app/AppRouter.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Outlet } from 'react-router';

// ---- MOCKS ----

// Layout principal
vi.mock('@/layout/AppLayout', () => ({
  default: () => (
    <div>
      AppLayout Mock
      <Outlet />
    </div>
  ),
}));

// Rutas protegidas / públicas
vi.mock('@/features/auth/components/ProtectedRoutes', () => ({
  ProtectedRoutes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/features/auth/components/PublicOnlyRoutes', () => ({
  PublicOnlyRoutes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// RoleGuard (siempre deja pasar)
vi.mock('@/features/auth', () => ({
  RoleGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ---- PÁGINAS MOCK ----
vi.mock('@/features/auth/pages/SignInPage', () => ({
  SignInPage: () => <div>SignIn Page Mock</div>,
}));

vi.mock('@/features/auth/pages/SignUpPage', () => ({
  SignUpPage: () => <div>SignUp Page Mock</div>,
}));

vi.mock('@/features/auth/pages/GoogleCallbackPage', () => ({
  GoogleCallbackPage: () => <div>Google Callback Page Mock</div>,
}));

vi.mock('@/features/auth/pages/MicrosoftCallbackPage', () => ({
  default: () => <div>Microsoft Callback Page Mock</div>,
}));

vi.mock('@/shared/pages/NotFoundPage', () => ({
  NotFoundPage: () => <div>Not Found Page Mock</div>,
}));

vi.mock('@/features/users', () => ({
  UsersManagementPage: () => <div>Users Management Page Mock</div>,
}));

vi.mock('@/features/courses', () => ({
  CoursesListPage: () => <div>Courses List Page Mock</div>,
  CourseDetailPage: () => <div>Course Detail Page Mock</div>,
  MyCoursesPage: () => <div>My Courses Page Mock</div>,
  CourseTopicsViewPage: () => <div>Course Topics View Page Mock</div>,
}));

vi.mock('@/features/courses/pages/CourseTemplateEditorPage', () => ({
  CourseTemplateEditorPage: () => <div>Course Template Editor Page Mock</div>,
}));

vi.mock('@/features/topics', () => ({
  TopicPublicViewPage: () => <div>Topic Public View Page Mock</div>,
}));

vi.mock('@/features/editions', () => ({
  EditionDetailPage: () => <div>Edition Detail Page Mock</div>,
}));

// ---- HELPER: renderizar el router con una ruta inicial ----
const renderWithRoute = async (path: string) => {
  // 1) Cambiamos la URL
  window.history.pushState({}, '', path);

  // 2) Reseteamos el registry de módulos para que AppRouter se importe "fresco"
  await vi.resetModules();

  // 3) Import dinámico después del reset → crea un router nuevo con la URL actual
  const { AppRouterProvider } = await import('./AppRouter');

  // 4) Renderizamos
  return render(<AppRouterProvider />);
};

// ---- TESTS ----
describe('AppRouter', () => {
  it('redirige "/" a "/dashboard" y muestra el Dashboard', async () => {
    await renderWithRoute('/');

    expect(
      await screen.findByText(/Dashboard \(Por implementar\)/i)
    ).toBeInTheDocument();
  });

  it('muestra la página de login en "/login"', async () => {
    await renderWithRoute('/login');

    expect(
      await screen.findByText(/SignIn Page Mock/i)
    ).toBeInTheDocument();
  });

  it('muestra la página de registro en "/register"', async () => {
    await renderWithRoute('/register');

    expect(
      await screen.findByText(/SignUp Page Mock/i)
    ).toBeInTheDocument();
  });

  it('muestra NotFoundPage en una ruta desconocida', async () => {
    await renderWithRoute('/ruta-que-no-existe');

    expect(
      await screen.findByText(/Not Found Page Mock/i)
    ).toBeInTheDocument();
  });

  it('muestra UsersManagementPage en "/users" (RoleGuard mockeado)', async () => {
    await renderWithRoute('/users');

    expect(
      await screen.findByText(/Users Management Page Mock/i)
    ).toBeInTheDocument();
  });
});
