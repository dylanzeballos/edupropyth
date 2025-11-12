/**
 * Genera un código de inscripción aleatorio
 * @param length - Longitud del código (default: 8)
 * @returns Código alfanumérico en mayúsculas
 */
export const generateEnrollmentKey = (length: number = 8): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin caracteres ambiguos (I, O, 0, 1)
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  
  return result;
};

/**
 * Formatea un código de inscripción en grupos de 4 caracteres
 * @param key - Código a formatear
 * @returns Código formateado (ej: ABCD-EFGH)
 */
export const formatEnrollmentKey = (key: string): string => {
  return key.replace(/(.{4})/g, '$1-').replace(/-$/, '');
};
