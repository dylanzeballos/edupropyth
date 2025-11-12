import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';  // Ajusta la ruta de importación según corresponda
import { Heart } from 'lucide-react';  // Si vas a usar un ícono

describe('Button Component', () => {

  it('should render the button with the correct label', () => {
    render(<Button label="Click Me" />);
    
    // Verificar que el texto del botón se muestra correctamente
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should apply the correct style for primary variantColor', () => {
    render(<Button variantColor="primary" label="Primary Button" />);
    
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-blue-600');  // Verificar la clase para el fondo
  });

  it('should apply the correct style for the destructive variant', () => {
    render(<Button variant="destructive" label="Delete" />);
    
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-red-600');  // Verificar la clase para el fondo
  });

  it('should display a loading spinner when loading is true', () => {
    render(<Button loading={true} loadingText="Loading..." />);
    
    // Verificar que el ícono de carga está presente
    expect(screen.getByRole('status')).toHaveClass('animate-spin'); // El ícono de carga debería tener la clase `animate-spin`
    
    // Verificar el texto de carga
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should be disabled when loading is true', () => {
    render(<Button loading={true} label="Click Me" />);
    
    const button = screen.getByText('Click Me');
    expect(button).toBeDisabled();  // Verificar que el botón está deshabilitado cuando loading es true
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled={true} label="Click Me" />);
    
    const button = screen.getByText('Click Me');
    expect(button).toBeDisabled();  // Verificar que el botón está deshabilitado
  });

  it('should render icon1 and icon2 correctly', () => {
    render(
      <Button
        label="With Icons"
        icon1={Heart}
        icon2={Heart}
      />
    );

    // Verificar que los iconos estén presentes
    expect(screen.getByTestId('icon1')).toBeInTheDocument();
    expect(screen.getByTestId('icon2')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} label="Click Me" />);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);  // Verificar que el onClick fue llamado
  });

});
