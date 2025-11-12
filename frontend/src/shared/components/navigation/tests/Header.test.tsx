import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

// Mock del store de auth para controlar el usuario en cada test
const useAuthStoreMock = vi.fn();
vi.mock('@/features/auth', () => ({
  useAuthStore: () => useAuthStoreMock(),
}));

// Mock del SearchBar para no depender de su implementación (y poder simular onQueryChange)
vi.mock('../Search', () => ({
  default: ({ onQueryChange, placeholder }: { onQueryChange: (q: string) => void; placeholder: string }) => (
    <button data-testid="searchbar" onClick={() => onQueryChange('')}>
      {placeholder}
    </button>
  ),
}));



describe('Header Component', () => {
  beforeEach(() => {
    // Valor por defecto del usuario
    useAuthStoreMock.mockReturnValue({
      user: { firstName: 'Fabricio', email: 'fabricio@test.com' },
    });
  });

  const renderHeader = (props?: Partial<React.ComponentProps<typeof Header>>) => {
    const defaultProps = {
      sidebarWidth: 256,
      onMenuClick: vi.fn(),
      isMobile: false,
    };
    return render(<Header {...defaultProps} {...props} />);
  };

  it('muestra el botón de menú en móvil y dispara onMenuClick', () => {
    const onMenuClick = vi.fn();
    renderHeader({ isMobile: true, onMenuClick });

    // El botón de menú se renderiza (mockeado como motion.button)
    const buttons = screen.getAllByRole('button');
    // El primero suele ser el menú en esta maqueta (también está el de notificaciones)
    fireEvent.click(buttons[0]);

    expect(onMenuClick).toHaveBeenCalledTimes(1);
    // También debería verse el logo/brand en móvil
    expect(screen.getByText('EduProPyth')).toBeInTheDocument();
  });

  it('no muestra el botón de menú en desktop (isMobile=false)', () => {
    renderHeader({ isMobile: false });
    // En desktop, el brand EDP/EduProPyth no aparece y hay menos botones
    // (solo el de notificaciones)
    const buttons = screen.getAllByRole('button');
    // Debe existir al menos 1 (notificaciones), pero no el del menú móvil
    // No hacemos aserción por cantidad exacta para evitar fragilidad;
    // verificamos que NO exista el texto de brand móvil:
    expect(screen.queryByText('EduProPyth')).not.toBeInTheDocument();
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('muestra saludo con firstName cuando está disponible', () => {
    useAuthStoreMock.mockReturnValueOnce({
      user: { firstName: 'Fabricio', email: 'fabricio@test.com' },
    });

    renderHeader();
    expect(screen.getByText(/Bienvenido de vuelta/i)).toBeInTheDocument();
    expect(screen.getByText(/Fabricio/i)).toBeInTheDocument();
  });

  it('usa email si no hay firstName', () => {
    useAuthStoreMock.mockReturnValueOnce({
      user: { firstName: '', email: 'correo@ejemplo.com' },
    });

    renderHeader();
    expect(screen.getByText(/correo@ejemplo\.com/i)).toBeInTheDocument();
  });

  it('usa "Usuario" si no hay user', () => {
    useAuthStoreMock.mockReturnValueOnce({
      user: undefined,
    });

    renderHeader();
    expect(screen.getByText(/Usuario/i)).toBeInTheDocument();
  });

  it('renderiza el SearchBar (mock) y soporta onQueryChange', () => {
    renderHeader();
    const search = screen.getByTestId('searchbar');
    // Nuestro mock dispara onQueryChange al hacer click
    fireEvent.click(search);
    // No hay estado observable luego del reset interno, solo verificamos que el placeholder se muestra
    expect(search).toHaveTextContent('Buscar ejercicios, tópicos...');
  });

  it('aplica el padding dinámico a partir de sidebarWidth (sanity check)', () => {
    // No validamos la animación, solo que el header se pinta
    renderHeader({ sidebarWidth: 320 });
    // El header existe
    const header = screen.getByRole('banner'); // <header> expone rol "banner"
    expect(header).toBeInTheDocument();
  });
});
