import { useState, useCallback } from 'react';

/**
 * Hook genérico para manejar estados de modals con datos asociados
 * @template T Tipo de datos que el modal maneja
 */
export const useModalState = <T = unknown>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Limpiar datos después de cerrar
    setTimeout(() => setData(null), 200);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  };
};

/**
 * Hook para manejar múltiples modals relacionados
 * Útil cuando tienes varios modals en la misma página (create, edit, delete)
 */
export const useModals = () => {
  const [modals, setModals] = useState<Record<string, boolean>>({});
  const [modalData, setModalData] = useState<Record<string, unknown>>({});

  const openModal = useCallback((modalName: string, data?: unknown) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
    if (data !== undefined) {
      setModalData(prev => ({ ...prev, [modalName]: data }));
    }
  }, []);

  const closeModal = useCallback((modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    // Limpiar datos después de cerrar
    setTimeout(() => {
      setModalData(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [modalName]: _, ...rest } = prev;
        return rest;
      });
    }, 200);
  }, []);

  const isModalOpen = useCallback((modalName: string) => {
    return modals[modalName] || false;
  }, [modals]);

  const getModalData = useCallback(<T = unknown,>(modalName: string): T | null => {
    return (modalData[modalName] as T) || null;
  }, [modalData]);

  return {
    openModal,
    closeModal,
    isModalOpen,
    getModalData,
  };
};
