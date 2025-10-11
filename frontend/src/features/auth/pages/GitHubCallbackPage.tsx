import { useEffect, useRef } from 'react';

export const GitHubCallbackPage = () => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleGitHubCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (window.opener && !window.opener.closed) {
        if (error) {
          window.opener.postMessage(
            {
              type: 'GITHUB_AUTH_ERROR',
              error: error,
            },
            window.location.origin,
          );
          setTimeout(() => window.close(), 100);
          return;
        }

        if (code) {
          window.opener.postMessage(
            {
              type: 'GITHUB_AUTH_SUCCESS',
              code: code,
            },
            window.location.origin,
          );
          setTimeout(() => window.close(), 100);
          return;
        }
      }
    };

    handleGitHubCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-t-4 border-blue-500 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🐙</span>
          </div>
        </div>
        <p className="mt-6 text-xl font-semibold text-white">
          Procesando autenticación con GitHub...
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Por favor espera un momento
        </p>
      </div>
    </div>
  );
};

export default GitHubCallbackPage;
