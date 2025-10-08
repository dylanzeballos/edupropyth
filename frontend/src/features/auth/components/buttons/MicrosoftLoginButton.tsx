import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth.service';
import { Microsoft } from '@/shared/components/icons';

const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
const MICROSOFT_REDIRECT_URI = import.meta.env.VITE_MICROSOFT_REDIRECT_URI;

export const MicrosoftLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleMicrosoftLogin = () => {
    const microsoftAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${MICROSOFT_REDIRECT_URI}&response_mode=query&scope=User.Read&state=${Math.random().toString(
      36,
    )}`;

    const popup = window.open(
      microsoftAuthUrl,
      'microsoft-login',
      'width=600,height=700,scrollbars=yes, resizable=yes',
    );

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'MICROSOFT_AUTH_SUCCESS') {
        setIsLoading(true);
        try {
          const response = await authService.microsoftLogin(event.data.code);
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
          console.error('Microsoft login error:', error);
        } finally {
          setIsLoading(false);
        }
      }

      if (event.data.type === 'MICROSOFT_AUTH_ERROR') {
        console.error('Microsoft login error:', event.data.error);
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
    }, 1000);
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
