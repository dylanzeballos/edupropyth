import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { useForm, FormProvider, UseFormRegister, FieldValues, FieldError, RegisterOptions } from 'react-hook-form'; // Asegúrate de importar UseFormRegister y FieldValues
import { InputText } from '../Input';

describe('InputText Component', () => {
  // Wrapper para envolver el formulario
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}><form>{children}<button type="submit">Enviar</button></form></FormProvider>;
  };

  // Renderizamos el componente InputText con las propiedades por defecto y las personalizadas
  const renderInput = (props: Partial<React.ComponentProps<typeof InputText>> = {}) => {
    const defaultProps = {
      label: 'Test Label',
      name: 'testInput',
      placeholder: 'Escribe aquí',
      register: vi.fn() as UseFormRegister<FieldValues>, // Tipado correcto para register
      errors: {} as Record<string, FieldError>, // Errores tipados correctamente
      validationRules: {} as RegisterOptions, // Tipamos validationRules correctamente
      isRequired: false,
    };

    render(
      <Wrapper>
        <InputText
          {...defaultProps}  // Propiedades por defecto
          {...props}          // Propiedades personalizadas
        />
      </Wrapper>
    );
  };

  it('should render the input with label and placeholder', () => {
    renderInput();
    expect(screen.getByRole('textbox', { name: /test label/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument();
  });

  it('should display error message when required field is not filled', async () => {
    renderInput({
      isRequired: true,
      errors: { testInput: { message: 'Este campo es obligatorio' } as FieldError },
    });
    expect(await screen.findByText('Este campo es obligatorio')).toBeInTheDocument();
  });

  it('should convert text to uppercase when toUpperCase is true', () => {
    renderInput({ toUpperCase: true });
    const input = screen.getByRole('textbox', { name: /test label/i }) as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'hello' } });
    expect(input.value).toBe('HELLO');
  });

  it('should call onInput handler when input value changes', () => {
    const onInput = vi.fn();
    renderInput({ onInput });
    const input = screen.getByRole('textbox', { name: /test label/i }) as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'new value' } });
    expect(onInput).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    renderInput({ disabled: true });
    const input = screen.getByRole('textbox', { name: /test label/i }) as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('should only allow numeric input for type="number"', () => {
    renderInput({ type: 'number' });
    const input = screen.getByRole('spinbutton', { name: /test label/i }) as HTMLInputElement;

    fireEvent.keyDown(input, { key: 'a' });
    expect(input.value).toBe('');

    fireEvent.keyDown(input, { key: '5' });
  });

  it('should respect maxLength from validationRules', () => {
    renderInput({ validationRules: { maxLength: 5 } });
    const input = screen.getByRole('textbox', { name: /test label/i }) as HTMLInputElement;

    fireEvent.input(input, { target: { value: '123456789' } });
    expect(input.value).toBe('12345');
  });

  it('should enforce pattern from validationRules (keeps last valid value)', () => {
    renderInput({ validationRules: { pattern: /^[A-Z]*$/ }, toUpperCase: false });
    const input = screen.getByRole('textbox', { name: /test label/i }) as HTMLInputElement;

    fireEvent.input(input, { target: { value: 'ABC' } });
    expect(input.value).toBe('ABC');

    fireEvent.input(input, { target: { value: 'ABc' } });
    expect(input.value).toBe('ABC');
  });
});
