import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth.service';
import { GitHub } from '@/shared/components/icons';
import { toast } from 'sonner';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

export const GitHubLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleGitHubLogin = () => {
    const state = Math.random().toString(36).substring(7);
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      GITHUB_REDIRECT_URI,
    )}&scope=user:email&state=${state}`;

    const popup = window.open(
      githubAuthUrl,
      'github-login',
      'width=600,height=700,left=200,top=100,scrollbars=yes,resizable=yes',
    );

    if (!popup) {
      toast.error(
        'No se pudo abrir la ventana de GitHub. Por favor, habilita las ventanas emergentes.',
      );
      return;
    }

    setIsLoading(true);

    let isProcessing = false;

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (isProcessing) return; 

      if (event.data.type === 'GITHUB_AUTH_SUCCESS') {
        isProcessing = true;
        window.removeEventListener('message', handleMessage);

        try {
          const response = await authService.githubLogin(event.data.code);

          const user = {
            id: response.user.id.toString(),
            email: response.user.email,
            firstName: response.user.first_name,
            lastName: response.user.last_name,
            userType: (response.user.profile_role === 'instructor'
              ? 'Profesor'
              : response.user.profile_role === 'admin'
              ? 'Admin'
              : 'Estudiante') as 'Estudiante' | 'Profesor' | 'Admin',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setAuth(user, response.access_token, response.refresh_token);

          toast.success('¡Autenticación exitosa!', {
            description: `Bienvenido ${user.firstName} ${user.lastName}`,
          });

          navigate('/dashboard');
          popup?.close();
        } catch (error: unknown) {
          console.error('GitHub login error:', error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'No se pudo completar la autenticación con GitHub';
          toast.error('Error al iniciar sesión', {
            description: errorMessage,
          });
        } finally {
          setIsLoading(false);
          isProcessing = false;
        }
      }

      if (event.data.type === 'GITHUB_AUTH_ERROR') {
        window.removeEventListener('message', handleMessage);
        toast.error('Error de autenticación', {
          description: 'No se pudo autenticar con GitHub',
        });
        setIsLoading(false);
        popup?.close();
      }
    };

    window.addEventListener('message', handleMessage);

    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        setIsLoading(false);
      }
    }, 500);
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
