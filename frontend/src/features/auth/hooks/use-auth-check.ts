import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

export const useAuthCheck = () => {
  const { isAuthenticated, accessToken, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      
      try {
        if (accessToken) {
          const isValidToken = accessToken && accessToken.length > 0;
          
          if (!isValidToken) {
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [accessToken, setLoading, clearAuth]);

  return {
    isAuthenticated,
    isLoading: useAuthStore(state => state.isLoading),
  };
};

export default useAuthCheck;