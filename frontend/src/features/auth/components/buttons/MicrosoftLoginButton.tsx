import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth.service';
import { Microsoft } from '@/shared/components/icons';
import { toast } from 'sonner';

const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
const MICROSOFT_REDIRECT_URI = import.meta.env.VITE_MICROSOFT_REDIRECT_URI;

export const MicrosoftLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const hasProcessedRef = useRef(false);

  const handleMicrosoftLogin = () => {
    const state = Math.random().toString(36).substring(7);
    const microsoftAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      MICROSOFT_REDIRECT_URI,
    )}&response_mode=query&scope=User.Read&state=${state}&prompt=select_account`;

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      microsoftAuthUrl,
      'microsoft-login',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
    );

    if (!popup) {
      toast.error(
        'No se pudo abrir la ventana de Microsoft. Por favor, habilita las ventanas emergentes.',
      );
      return;
    }

    setIsLoading(true);
    hasProcessedRef.current = false;

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        console.warn('Message from untrusted origin:', event.origin);
        return;
      }

      if (hasProcessedRef.current) {
        console.log('Already processed, ignoring duplicate message');
        return;
      }

      if (event.data.type === 'MICROSOFT_AUTH_SUCCESS') {
        hasProcessedRef.current = true;

        try {
          const response = await authService.microsoftLogin(event.data.code);

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

          try {
            popup?.close();
          } catch {
            console.log('Popup close blocked by COOP policy (expected)');
          }
        } catch (error: unknown) {
          console.error('Microsoft login error:', error);

          let errorMessage =
            'No se pudo completar la autenticación con Microsoft';

          if (error instanceof Error) {
            errorMessage = error.message;
          }

          toast.error('Error al iniciar sesión', {
            description: errorMessage,
          });
        } finally {
          setIsLoading(false);
          window.removeEventListener('message', handleMessage);
        }
      }

      if (event.data.type === 'MICROSOFT_AUTH_ERROR') {
        hasProcessedRef.current = true;
        toast.error('Error de autenticación', {
          description:
            event.data.errorDescription ||
            'No se pudo autenticar con Microsoft',
        });
        setIsLoading(false);

        try {
          popup?.close();
        } catch {
          console.log('Popup close blocked by COOP policy (expected)');
        }

        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    setTimeout(() => {
      window.removeEventListener('message', handleMessage);

      if (!hasProcessedRef.current) {
        setIsLoading(false);
        toast.info('Tiempo de autenticación agotado');
      }
    }, 300000);
  };

  return (
    <Button
      type="button"
      onClick={handleMicrosoftLogin}
      disabled={isLoading}
      loading={isLoading}
      loadingText="Conectando con Microsoft..."
      label="Continuar con Microsoft"
      icon1={Microsoft}
      className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
    />
  );
};
