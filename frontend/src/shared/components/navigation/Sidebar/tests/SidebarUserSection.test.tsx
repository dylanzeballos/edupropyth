// src/shared/components/navigation/Sidebar/tests/SidebarUserSection.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarUserSection } from '../SidebarUserSection';

// Inferimos el tipo de props desde el propio componente
type SidebarUserSectionProps = React.ComponentProps<typeof SidebarUserSection>;

const makeProps = (
  overrides?: Partial<SidebarUserSectionProps>
): SidebarUserSectionProps => ({
  isCollapsed: false,
  onLogout: vi.fn(),
  userInitials: 'EP',
  userDisplayName: 'EduPro Pyth',
  userRole: 'Administrador',
  ...overrides,
});

describe('SidebarUserSection', () => {
  it('muestra nombre, rol, iniciales, botón de logout y ThemeToggle cuando no está colapsado', () => {
    const props = makeProps();

    render(<SidebarUserSection {...props} />);

    // Iniciales
    expect(screen.getByText('EP')).toBeInTheDocument();
    // Nombre y rol
    expect(screen.getByText('EduPro Pyth')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
    // Botón de "Cerrar Sesión" con texto
    expect(
      screen.getByRole('button', { name: /Cerrar Sesión/i })
    ).toBeInTheDocument();
    // ThemeToggle real: botón con title "Modo claro"
    expect(screen.getByTitle('Modo claro')).toBeInTheDocument();
  });

  it('en modo colapsado NO muestra nombre ni rol, pero sí iniciales, botón y ThemeToggle', () => {
    const props = makeProps({ isCollapsed: true });

    render(<SidebarUserSection {...props} />);

    // Iniciales siguen visibles
    expect(screen.getByText('EP')).toBeInTheDocument();

    // Nombre y rol NO visibles
    expect(screen.queryByText('EduPro Pyth')).not.toBeInTheDocument();
    expect(screen.queryByText('Administrador')).not.toBeInTheDocument();

    // Botón de logout (sin texto, pero con title)
    const logoutButton = screen.getByTitle('Cerrar Sesión');
    expect(logoutButton).toBeInTheDocument();

    // ThemeToggle real: botón con title "Modo claro"
    expect(screen.getByTitle('Modo claro')).toBeInTheDocument();
  });

  it('llama a onLogout al hacer click en el botón de logout cuando NO está colapsado', () => {
    const onLogout = vi.fn();
    const props = makeProps({ onLogout, isCollapsed: false });

    render(<SidebarUserSection {...props} />);

    const logoutButton = screen.getByRole('button', { name: /Cerrar Sesión/i });
    fireEvent.click(logoutButton);

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('llama a onLogout al hacer click en el botón de logout cuando está colapsado', () => {
    const onLogout = vi.fn();
    const props = makeProps({ onLogout, isCollapsed: true });

    render(<SidebarUserSection {...props} />);

    const logoutButton = screen.getByTitle('Cerrar Sesión');
    fireEvent.click(logoutButton);

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('muestra las iniciales correctas según userInitials', () => {
    const props = makeProps({ userInitials: 'AB' });

    render(<SidebarUserSection {...props} />);

    expect(screen.getByText('AB')).toBeInTheDocument();
  });
});
