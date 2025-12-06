// src/shared/components/navigation/Sidebar/tests/SidebarLogo.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarLogo } from '../SidebarLogo';

describe('SidebarLogo', () => {
  const defaultProps = {
    isCollapsed: false,
    isMobile: false,
    onToggleCollapse: vi.fn(),
  };

  it('muestra el logo, título y subtítulo cuando no está colapsado', () => {
    render(<SidebarLogo {...defaultProps} />);

    expect(screen.getByText('EduProPyth')).toBeInTheDocument();
    expect(screen.getByText('Plataforma Educativa')).toBeInTheDocument();
  });

  it('no muestra título ni subtítulo cuando está colapsado', () => {
    render(
      <SidebarLogo
        {...defaultProps}
        isCollapsed={true}
      />
    );

    expect(screen.queryByText('EduProPyth')).not.toBeInTheDocument();
    expect(screen.queryByText('Plataforma Educativa')).not.toBeInTheDocument();
  });

  it('muestra el botón de toggle en desktop y llama a onToggleCollapse al hacer click', () => {
    const handleToggle = vi.fn();

    render(
      <SidebarLogo
        {...defaultProps}
        isMobile={false}
        onToggleCollapse={handleToggle}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('no muestra el botón de toggle cuando es mobile', () => {
    render(
      <SidebarLogo
        {...defaultProps}
        isMobile={true}
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('cambia el icono del botón cuando se colapsa/expande', () => {
    const { container, rerender } = render(
      <SidebarLogo
        {...defaultProps}
        isCollapsed={false}
      />
    );

    const buttonExpanded = container.querySelector('button');
    expect(buttonExpanded).not.toBeNull();

    const expandedHTML = buttonExpanded!.innerHTML;

    rerender(
      <SidebarLogo
        {...defaultProps}
        isCollapsed={true}
      />
    );

    const buttonCollapsed = container.querySelector('button');
    expect(buttonCollapsed).not.toBeNull();

    const collapsedHTML = buttonCollapsed!.innerHTML;

    // Si el icono cambia, el contenido del botón también
    expect(collapsedHTML).not.toBe(expandedHTML);
  });
});
