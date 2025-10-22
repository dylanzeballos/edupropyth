import { useEffect } from 'react';

export const GoogleCallbackPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (window.opener) {
      if (code) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_SUCCESS',
            code: code,
          },
          window.location.origin,
        );
      } else if (error) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_ERROR',
            error: error,
          },
          window.location.origin,
        );
      }
      window.close();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Procesando autenticación con Google...
        </p>
      </div>
    </div>
  );
};
