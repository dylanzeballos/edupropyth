// src/shared/components/navigation/Sidebar/tests/SidebarNavItem.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarNavItem } from '../SidebarNavItem';

// Mock de Link de react-router para no necesitar un Router real
vi.mock('react-router', () => ({
  Link: ({
    children,
    to,
    onClick,
  }: {
    children: React.ReactNode;
    to: string;
    onClick?: () => void;
  }) => (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  ),
}));

// Icono de prueba
const MockIcon = ({ className }: { className?: string }) => (
  <svg data-testid="sidebar-icon" className={className} />
);

// Inferimos los tipos desde el propio componente
type SidebarNavItemComponentProps = React.ComponentProps<typeof SidebarNavItem>;
type ItemType = SidebarNavItemComponentProps['item'];

const baseItem: ItemType = {
  id: 'dashboard',
  path: '/dashboard',
  label: 'Dashboard',
  icon: MockIcon as ItemType['icon'],
} as ItemType;

const makeProps = (
  overrides?: Partial<SidebarNavItemComponentProps>
): SidebarNavItemComponentProps => ({
  item: baseItem,
  isActive: false,
  isCollapsed: false,
  isMobile: false,
  onClose: vi.fn(),
  ...overrides,
});

describe('SidebarNavItem', () => {
  it('renderiza etiqueta y badge cuando no está colapsado y tiene badge', () => {
    const props = makeProps({
      item: {
        ...baseItem,
        
        badge: 3,
      } as ItemType,
    });

    render(<SidebarNavItem {...props} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    // React renderiza 3 como "3", así que esto sigue funcionando
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-icon')).toBeInTheDocument();
  });

  it('no renderiza etiqueta ni badge cuando está colapsado, pero sí el icono', () => {
    const props = makeProps({
      isCollapsed: true,
      item: {
        ...baseItem,
        badge: 5, // 👈 número
      } as ItemType,
    });

    render(<SidebarNavItem {...props} />);

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
    expect(screen.getByTestId('sidebar-icon')).toBeInTheDocument();
  });

  it('usa title con el label cuando está colapsado', () => {
    const props = makeProps({ isCollapsed: true });

    const { container } = render(<SidebarNavItem {...props} />);

    const motionDiv = container.querySelector('div');
    expect(motionDiv).not.toBeNull();
    expect(motionDiv!.getAttribute('title')).toBe('Dashboard');
  });

  it('no usa title cuando NO está colapsado', () => {
    const props = makeProps({ isCollapsed: false });

    const { container } = render(<SidebarNavItem {...props} />);

    const motionDiv = container.querySelector('div');
    expect(motionDiv).not.toBeNull();
    expect(motionDiv!.getAttribute('title')).toBeNull();
  });

  it('aplica clases de estado activo cuando isActive=true', () => {
    const props = makeProps({ isActive: true });

    const { container } = render(<SidebarNavItem {...props} />);

    const motionDiv = container.querySelector('div');
    expect(motionDiv).not.toBeNull();

    const className = motionDiv!.className;
    expect(className).toContain('bg-gradient-to-r');
    expect(className).toContain('from-blue-500');
    expect(className).toContain('to-cyan-600');
    expect(className).toContain('text-white');
  });

  it('aplica clases de estado inactivo cuando isActive=false', () => {
    const props = makeProps({ isActive: false });

    const { container } = render(<SidebarNavItem {...props} />);

    const motionDiv = container.querySelector('div');
    expect(motionDiv).not.toBeNull();

    const className = motionDiv!.className;
    expect(className).toContain('hover:bg-gray-100/50');
    expect(className).toContain('dark:hover:bg-gray-800/50');
  });

  it('llama a onClose al hacer click cuando es mobile', () => {
    const onClose = vi.fn();
    const props = makeProps({
      isMobile: true,
      onClose,
    });

    render(<SidebarNavItem {...props} />);

    const link = screen.getByRole('link', { name: /dashboard/i });
    fireEvent.click(link);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('NO llama a onClose al hacer click cuando NO es mobile', () => {
    const onClose = vi.fn();
    const props = makeProps({
      isMobile: false,
      onClose,
    });

    render(<SidebarNavItem {...props} />);

    const link = screen.getByRole('link', { name: /dashboard/i });
    fireEvent.click(link);

    expect(onClose).not.toHaveBeenCalled();
  });
});
