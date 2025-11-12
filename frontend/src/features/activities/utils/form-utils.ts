import type { CreateActivityFormData } from '../validation/activity.schema';

/**
 * Formatea una fecha ISO 8601 al formato datetime-local (YYYY-MM-DDTHH:mm)
 */
export const formatDateForInput = (isoDate?: string): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Limpia los datos del formulario antes de enviarlos al backend
 * - Convierte strings vacíos a undefined para campos opcionales
 * - Convierte maxScore a número
 */
export const cleanActivityFormData = (
  data: CreateActivityFormData,
): CreateActivityFormData => {
  return {
    ...data,
    dueDate:
      data.dueDate && data.dueDate.trim() !== '' ? data.dueDate : undefined,
    maxScore:
      data.maxScore !== null && data.maxScore !== undefined
        ? Number(data.maxScore)
        : undefined,
  };
};

/**
 * Prepara los datos para una actualización (excluye topicId y type)
 */
export const prepareUpdateData = (
  data: CreateActivityFormData,
): Partial<CreateActivityFormData> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { topicId, type, ...dataForUpdate } = data;
  return dataForUpdate;
};
