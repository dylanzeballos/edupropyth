// src/shared/components/ui/tests/EmptyState.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState UI Component', () => {
  const defaultProps = {
    title: 'Sin resultados',
    description: 'No se encontró ningún elemento que coincida con tu búsqueda.',
  };

  it('renderiza el título y la descripción', () => {
    render(<EmptyState {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: /sin resultados/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/no se encontró ningún elemento que coincida/i)
    ).toBeInTheDocument();
  });

  it('muestra el icono por defecto cuando no se pasa icon', () => {
    const { container } = render(<EmptyState {...defaultProps} />);

    // Buscamos directamente el elemento <svg> del ícono por defecto
    const defaultIcon = container.querySelector('svg');
    expect(defaultIcon).toBeInTheDocument();
  });

  it('muestra el icono personalizado cuando se pasa "icon"', () => {
    const { container } = render(
      <EmptyState
        {...defaultProps}
        icon={<span data-testid="custom-icon">★</span>}
      />
    );

    // Debe existir el icono custom
    const customIcon = screen.getByTestId('custom-icon');
    expect(customIcon).toBeInTheDocument();

    // Y no debería renderizarse el SVG por defecto
    const defaultSvg = container.querySelector('svg');
    expect(defaultSvg).toBeNull();
  });

  it('renderiza el botón cuando se pasan "actionLabel" y "onAction"', () => {
    const handleAction = vi.fn();

    render(
      <EmptyState
        {...defaultProps}
        actionLabel="Agregar elemento"
        onAction={handleAction}
      />
    );

    const button = screen.getByRole('button', { name: /agregar elemento/i });
    expect(button).toBeInTheDocument();
  });

  it('no renderiza el botón si falta "actionLabel" o "onAction"', () => {
    const handleAction = vi.fn();

    const { rerender } = render(
      <EmptyState
        {...defaultProps}
        actionLabel="Agregar elemento"
      />
    );

    expect(
      screen.queryByRole('button', { name: /agregar elemento/i })
    ).not.toBeInTheDocument();

    rerender(
      <EmptyState
        {...defaultProps}
        onAction={handleAction}
      />
    );

    expect(
      screen.queryByRole('button', { name: /agregar elemento/i })
    ).not.toBeInTheDocument();
  });

  it('ejecuta "onAction" al hacer click en el botón', () => {
    const handleAction = vi.fn();

    render(
      <EmptyState
        {...defaultProps}
        actionLabel="Agregar elemento"
        onAction={handleAction}
      />
    );

    const button = screen.getByRole('button', { name: /agregar elemento/i });
    fireEvent.click(button);

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('aplica correctamente la className extra en el contenedor', () => {
    render(
      <EmptyState
        {...defaultProps}
        className="bg-red-100"
      />
    );

    const container = screen.getByText(defaultProps.description).closest('div');
    expect(container).toHaveClass('bg-red-100');
  });
});
