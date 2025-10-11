import { useEffect, useRef } from 'react';

export const MicrosoftCallbackPage = () => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleMicrosoftCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (window.opener) {
        if (error) {
          window.opener.postMessage(
            {
              type: 'MICROSOFT_AUTH_ERROR',
              error: error,
              errorDescription: errorDescription,
            },
            window.location.origin,
          );
          setTimeout(() => window.close(), 100);
          return;
        }

        if (code) {
          window.opener.postMessage(
            {
              type: 'MICROSOFT_AUTH_SUCCESS',
              code: code,
            },
            window.location.origin,
          );
          setTimeout(() => window.close(), 100);
          return;
        }
      }
    };

    handleMicrosoftCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-t-4 border-white mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🪟</span>
          </div>
        </div>
        <p className="mt-6 text-xl font-semibold text-white">
          Procesando autenticación con Microsoft...
        </p>
        <p className="mt-2 text-sm text-blue-200">
          Por favor espera un momento
        </p>
      </div>
    </div>
  );
};

export default MicrosoftCallbackPage;
