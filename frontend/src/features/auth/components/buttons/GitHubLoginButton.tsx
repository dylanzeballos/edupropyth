import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth.service';
import { GitHub } from '@/shared/components/icons';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

export const GitHubLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleGitHubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email&state=${Math.random().toString(
      36,
    )}`;

    const popup = window.open(
      githubAuthUrl,
      'github-login',
      'width=600,height=700,scrollbars=yes, resizable=yes',
    );

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GITHUB_AUTH_SUCCESS') {
        setIsLoading(true);
        try {
          const response = await authService.githubLogin(event.data.code);
          // Adaptar la respuesta al formato esperado por el store
          const user = {
            id: response.id.toString(),
            email: response.email,
            firstName: response.first_name,
            lastName: response.last_name,
            userType: response.profile_role as
              | 'Estudiante'
              | 'Profesor'
              | 'Admin',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Necesitamos obtener los tokens del response - ajustar según tu backend
          setAuth(user, 'token_placeholder', 'refresh_token_placeholder');
          navigate('/dashboard');
          popup?.close();
        } catch (error) {
          console.error('GitHub login error:', error);
        } finally {
          setIsLoading(false);
        }
      }

      if (event.data.type === 'GITHUB_AUTH_ERROR') {
        console.error('GitHub login error:', event.data.error);
        popup?.close();
      }

      window.removeEventListener('message', handleMessage);
    };

    window.addEventListener('message', handleMessage);

    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <Button
      type="button"
      onClick={handleGitHubLogin}
      disabled={isLoading}
      loading={isLoading}
      loadingText="Conectando con GitHub..."
      label="Continuar con GitHub"
      icon1={GitHub}
      className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 transition-colors duration-200"
    />
  );
};
