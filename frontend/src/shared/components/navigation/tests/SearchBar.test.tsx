import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../Search';

describe('SearchBar', () => {
  const setup = (props?: Partial<React.ComponentProps<typeof SearchBar>>) => {
    const onQueryChange = vi.fn();
    const defaultProps: React.ComponentProps<typeof SearchBar> = {
      query: '',
      onQueryChange,
      placeholder: 'Buscar ejercicios, tópicos...',
    };

    const utils = render(<SearchBar {...defaultProps} {...props} />);
    const input = utils.container.querySelector('input') as HTMLInputElement;
    return { ...utils, input, onQueryChange, defaultProps };
  };

  it('renderiza el input con el placeholder por defecto', () => {
    const { input, defaultProps } = setup();
    expect(input).toBeInTheDocument();
    expect(input.placeholder).toBe(defaultProps.placeholder);
    // No dependemos de iconos; opcionalmente verificar que hay un contenedor a la izquierda
    // const leftIconContainer = screen.getByText((_, node) =>
    //   node?.parentElement?.className.includes('absolute left-3') ?? false
    // );
  });

  it('permite usar un placeholder personalizado', () => {
    const placeholder = 'Buscar cursos...';
    const { input } = setup({ placeholder });
    expect(input.placeholder).toBe(placeholder);
  });

  it('muestra el valor controlado en el input', () => {
    const { input } = setup({ query: 'python' });
    expect(input.value).toBe('python');
  });

  it('llama a onQueryChange al escribir', () => {
    const { input, onQueryChange } = setup({ query: '' });
    fireEvent.change(input, { target: { value: 'algo' } });
    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(onQueryChange).toHaveBeenCalledWith('algo');
  });

  it('muestra el botón de limpiar cuando hay texto y al click llama onQueryChange("")', () => {
    const { onQueryChange } = setup({ query: 'react' });
    // cuando hay texto, existe 1 botón (el de limpiar)
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(onQueryChange).toHaveBeenCalledWith('');
  });

  it('no muestra el botón de limpiar cuando query está vacío', () => {
    setup({ query: '' });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
