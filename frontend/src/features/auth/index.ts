// Componentes
export { default as ProtectedRoutes } from './components/ProtectedRoutes';
export { default as PublicOnlyRoutes } from './components/PublicOnlyRoutes';
// export { default as AuthLayout } from './components/AuthLayout';
// export { default as GoogleLoginButton } from './components/GoogleLoginButton';

// Forms
// export { default as LoginForm } from './components/forms/LoginForm';
// export { default as RegisterForm } from './components/forms/RegisterForm';

// Selectors
// export { default as UserTypeSelector } from './components/selectors/UserTypeSelector';

// Pages
export { SignInPage } from './pages/SignInPage';
export { SignUpPage } from './pages/SignUpPage';
export { default as DashboardPage } from './pages/DashboardPage';

// Hooks
//export { default as useGoogle } from './hooks/use-google';
//export { default as useLoginUser } from './hooks/use-login-user';
//export { default as useRegisterUser } from './hooks/use-register-user';
export { default as useAuthCheck } from './hooks/use-auth-check';

// Store
export { useAuthStore } from './stores/auth.store';

// Types
export type { User } from './types/user.type';
export type { LoginRequest, LoginResponse } from './types/login.types';

// Services
export * from './services/auth.service';
