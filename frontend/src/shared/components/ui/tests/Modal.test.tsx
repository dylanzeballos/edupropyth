import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';  // Ajusta la ruta de importación según corresponda
import { vi } from 'vitest';

describe('Modal Component', () => {
  it('should render the modal when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test Modal">Modal content</Modal>);

    // Verificar que el modal y el contenido se renderizan
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render the modal when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Test Modal">Modal content</Modal>);

    // Verificar que el modal no está en el documento
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should call onClose when clicking the close button', () => {
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test Modal">Modal content</Modal>);

    // Hacer clic en el botón de cierre
    fireEvent.click(screen.getByRole('button'));

    // Verificar que onClose haya sido llamado
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking the backdrop', () => {
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test Modal">Modal content</Modal>);

    // Hacer clic en el fondo (backdrop)
    fireEvent.click(screen.getByTestId('backdrop'));

    // Verificar que onClose haya sido llamado
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not render the close button when showCloseButton is false', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test Modal" showCloseButton={false}>Modal content</Modal>);

    // Verificar que el botón de cierre no está presente
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render the close button when showCloseButton is true', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test Modal" showCloseButton={true}>Modal content</Modal>);

    // Verificar que el botón de cierre está presente
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
