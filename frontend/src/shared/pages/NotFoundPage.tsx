import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToCourse = () => {
    navigate('/course');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Ilustración con código Python */}
        <div className="mb-8">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 text-left inline-block shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 text-sm ml-2">python_lab.py</span>
            </div>
            <div className="font-mono text-sm">
              <div className="text-purple-400">def</div>
              <span className="text-blue-400"> find_page</span>
              <span className="text-white">(</span>
              <span className="text-orange-400">url</span>
              <span className="text-white">):</span>
              <br />
              <span className="text-white ml-4">if url == "404":</span>
              <br />
              <span className="text-white ml-8">return </span>
              <span className="text-green-400">"Page not found! 🐍"</span>
              <br />
              <span className="text-white ml-4">else:</span>
              <br />
              <span className="text-white ml-8">return </span>
              <span className="text-green-400">"Welcome to EduProPyth!"</span>
            </div>
          </div>
        </div>

        {/* Error 404 */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-gray-300 dark:text-gray-600 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¡Oops! Página no encontrada
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Parece que esta página se fue a debuggear a otro lugar...
          </p>
          <p className="text-base text-gray-500 dark:text-gray-500">
            La URL que buscas no existe en nuestro laboratorio de Python.
          </p>
        </div>

        {/* Sugerencias con temática de programación */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 Sugerencias para debuggear:
          </h3>
          <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span>
              Verifica que la URL esté bien escrita
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span>
              Puede que la página haya sido movida o eliminada
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span>
              Intenta navegar desde el menú principal
            </li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button
            label="🏠 Ir al Inicio"
            onClick={handleGoHome}
            variantColor="primary"
            className="w-full sm:w-auto px-6 py-3"
          />
          <Button
            label="🐍 Ver el Curso"
            onClick={handleGoToCourse}
            variantColor="tertiary"
            className="w-full sm:w-auto px-6 py-3"
          />
          <Button
            label="← Volver"
            onClick={handleGoBack}
            variantColor="secondary"
            className="w-full sm:w-auto px-6 py-3"
          />
        </div>

        {/* Footer con temática Python */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
              import success_from_failure
            </span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Cada error es una oportunidad de aprender 🚀
          </p>
        </div>
      </div>
    </div>
  );
};
