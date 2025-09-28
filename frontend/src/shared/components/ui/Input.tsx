import { FieldValues } from 'react-hook-form';
import { InputProps } from '../../interfaces';

export const InputText = <T extends FieldValues>({
  label,
  name,
  type = 'text',
  placeholder,
  className = '',
  labelPadding = '',
  register,
  errors,
  validationRules = {},
  isRequired = true,
  onInput,
  toUpperCase = false,
}: InputProps<T> & { toUpperCase?: boolean }) => {
  const isTextType = type === 'text';

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    if (toUpperCase) {
      target.value = target.value.toUpperCase();
    }
    if (onInput) onInput(e);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelPadding}`}
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          errors ? 'border-red-500' : ''
        }`}
        {...register(name, {
          ...validationRules,
          required: isRequired ? 'Este campo es obligatorio' : false,
        })}
        onInput={isTextType ? handleInput : undefined}
      />
      {errors && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
    </div>
  );
};
