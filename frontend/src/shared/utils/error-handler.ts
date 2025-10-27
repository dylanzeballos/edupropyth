import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Extrae el mensaje de error de una respuesta de error de Axios
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as {
      message?: string;
      error?: string;
      statusCode?: number;
    };

    // Priorizar el mensaje del servidor
    if (data?.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message;
    }

    if (data?.error) {
      return data.error;
    }

    // Mensajes personalizados según el código de estado
    switch (error.response?.status) {
      case 400:
        return 'Solicitud incorrecta. Por favor verifica los datos enviados.';
      case 401:
        return 'No autorizado. Por favor inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no fue encontrado.';
      case 409:
        return 'Conflicto. El recurso ya existe o hay datos duplicados.';
      case 422:
        return 'Los datos proporcionados no son válidos.';
      case 429:
        return 'Demasiadas solicitudes. Por favor intenta más tarde.';
      case 500:
        return 'Error interno del servidor. Por favor intenta más tarde.';
      case 502:
        return 'El servidor no está disponible. Por favor intenta más tarde.';
      case 503:
        return 'Servicio no disponible. Por favor intenta más tarde.';
      default:
        return error.message || 'Ha ocurrido un error inesperado.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ha ocurrido un error inesperado.';
};

/**
 * Convierte un error desconocido en un objeto ApiError estructurado
 */
export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as {
      message?: string;
      error?: string;
      statusCode?: number;
      code?: string;
    };

    return {
      message: getErrorMessage(error),
      status: error.response?.status || data?.statusCode,
      code: data?.code || error.code,
      details: data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      details: error,
    };
  }

  return {
    message: 'Ha ocurrido un error inesperado.',
    details: error,
  };
};

/**
 * Verifica si un error es de tipo autenticación
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
};

/**
 * Verifica si un error es de tipo validación
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 400 || error.response?.status === 422;
  }
  return false;
};

/**
 * Verifica si un error es de red
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && error.code !== 'ECONNABORTED';
  }
  return false;
};

/**
 * Verifica si un error es de timeout
 */
export const isTimeoutError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.code === 'ECONNABORTED';
  }
  return false;
};

/**
 * Obtiene un mensaje de error amigable para el usuario
 */
export const getFriendlyErrorMessage = (error: unknown): string => {
  if (isNetworkError(error)) {
    return 'No se pudo conectar con el servidor. Por favor verifica tu conexión a internet.';
  }

  if (isTimeoutError(error)) {
    return 'La solicitud tardó demasiado tiempo. Por favor intenta nuevamente.';
  }

  if (isAuthError(error)) {
    return 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
  }

  return getErrorMessage(error);
};

/**
 * Registra el error en la consola (o servicio de logging)
 */
export const logError = (error: unknown, context?: string): void => {
  const apiError = parseApiError(error);

  if (import.meta.env.DEV) {
    console.group(`❌ Error${context ? ` en ${context}` : ''}`);
    console.error('Message:', apiError.message);
    if (apiError.status) console.error('Status:', apiError.status);
    if (apiError.code) console.error('Code:', apiError.code);
    if (apiError.details) console.error('Details:', apiError.details);
    console.groupEnd();
  }

  // Aquí podrías integrar un servicio de logging como Sentry
  // Sentry.captureException(error, { contexts: { info: { context } } });
};

/**
 * Maneja un error y devuelve un mensaje amigable
 */
export const handleError = (
  error: unknown,
  context?: string,
): { message: string; error: ApiError } => {
  logError(error, context);

  const apiError = parseApiError(error);
  const message = getFriendlyErrorMessage(error);

  return {
    message,
    error: apiError,
  };
};
