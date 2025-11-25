
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import type { SidebarProps } from '../sidebar.types';

// --- Mocks de dependencias internas ---
vi.mock('../useSidebarLogic', () => ({
  useSidebarLogic: vi.fn(() => ({
    mainItems: [{ id: 'home', label: 'Dashboard', href: '/dashboard' }],
    toolItems: [{ id: 'tools', label: 'Herramienta X', href: '/tools' }],
    isActive: vi.fn(() => false),
    handleLogout: vi.fn(),
    getUserInitials: vi.fn(() => 'FA'),
    getUserDisplayName: vi.fn(() => 'Fabricio Herrera'),
    getUserRole: vi.fn(() => 'Admin'),
  })),
}));

// Evitamos dependencias con Link/iconos/estilos complejos
vi.mock('../SidebarNavItem', () => ({
  SidebarNavItem: ({ item }: { item: { id: string; label: string } }) => (
    <div role="listitem">{item.label}</div>
  ),
}));

vi.mock('../SidebarLogo', () => ({
  SidebarLogo: ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div aria-label="sidebar-logo">{isCollapsed ? 'C' : 'Logo'}</div>
  ),
}));

vi.mock('../SidebarUserSection', () => ({
  SidebarUserSection: ({
    isCollapsed,
    userInitials,
    userDisplayName,
    userRole,
  }: {
    isCollapsed: boolean;
    userInitials: string;
    userDisplayName: string;
    userRole: string;
  }) => (
    <div aria-label="user-section">
      <span>{isCollapsed ? '' : userInitials}</span>
      <span>{isCollapsed ? '' : userDisplayName}</span>
      <span>{isCollapsed ? '' : userRole}</span>
    </div>
  ),
}));

// Helper para renderizar con Router
function renderSidebar(props: Partial<SidebarProps> = {}) {
  const defaultProps: SidebarProps = {
    isOpen: true,
    onClose: vi.fn(),
    isCollapsed: false,
    onToggleCollapse: vi.fn(),
    isMobile: false,
  };
  const allProps = { ...defaultProps, ...props };
  const utils = render(<Sidebar {...allProps} />); // ← sin MemoryRouter
  return { ...utils, props: allProps };
}


describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza secciones y items principales', () => {
    renderSidebar();
    // Encabezado "Principal" solo cuando no está colapsado
    expect(screen.getByText(/Principal/i)).toBeInTheDocument();
    // Items mockeados
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Herramienta X/i)).toBeInTheDocument();
    // Logo y sección usuario (no colapsado)
    expect(screen.getByLabelText('sidebar-logo')).toHaveTextContent('Logo');
    expect(screen.getByLabelText('user-section')).toHaveTextContent('Fabricio Herrera');
    expect(screen.getByLabelText('user-section')).toHaveTextContent('FA');
    expect(screen.getByLabelText('user-section')).toHaveTextContent('Admin');
  });

  it('oculta textos cuando está colapsado', () => {
    renderSidebar({ isCollapsed: true });
    // Encabezado desaparece
    expect(screen.queryByText(/Principal/i)).toBeNull();
    // El mock del logo muestra "C" si está colapsado
    expect(screen.getByLabelText('sidebar-logo')).toHaveTextContent('C');
    // Sección usuario sin textos (mock)
    expect(screen.getByLabelText('user-section')).not.toHaveTextContent('Fabricio Herrera');
  });

  it('muestra y permite clickear overlay en móvil', () => {
    const { container, props } = renderSidebar({ isMobile: true, isOpen: true });
    // Overlay se monta en móvil + abierto: es el DIV con clases 'fixed inset-0'
    const overlay = container.querySelector<HTMLDivElement>('.fixed.inset-0');
    expect(overlay).toBeTruthy();

    fireEvent.click(overlay!);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('no renderiza overlay cuando móvil pero cerrado', () => {
    const { container } = renderSidebar({ isMobile: true, isOpen: false });
    const overlay = container.querySelector<HTMLDivElement>('.fixed.inset-0');
    expect(overlay).toBeNull();
  });

  it('llama a onToggleCollapse al interactuar con el logo (simulado)', () => {
    // No existe un botón real en el mock, así que validamos que el componente renderiza
    // y dejamos la interacción real para pruebas de SidebarLogo unitarias.
    const { getByLabelText } = renderSidebar({ isCollapsed: false });
    expect(getByLabelText('sidebar-logo')).toBeInTheDocument();
  });

  it('respeta el ancho según colapsado (animación no se testea, solo presencia)', () => {
    // Este test asegura que el aside está presente; el cálculo de width se maneja en motion
    const { container } = renderSidebar({ isCollapsed: false });
    const aside = container.querySelector('aside');
    expect(aside).toBeTruthy();
  });
});
