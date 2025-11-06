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
  disabled = false,
}: InputProps<T> & { toUpperCase?: boolean }) => {
  const fieldError = errors?.[name];
  const hasError = !!fieldError;

  const maxLength = validationRules?.maxLength as number | undefined;
  const pattern = validationRules?.pattern as RegExp | undefined;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    let value = target.value;

    if (toUpperCase) {
      value = value.toUpperCase();
    }

    if (pattern && value) {
      if (!pattern.test(value)) {
        const lastValidValue = target.getAttribute('data-last-valid') || '';
        target.value = lastValidValue;
        return;
      }
    }

    if (maxLength && value.length > maxLength) {
      target.value = value.slice(0, maxLength);
      return;
    }

    target.setAttribute('data-last-valid', target.value);
    
    if (toUpperCase && target.value !== value) {
      target.value = value;
    }

    if (onInput) onInput(e);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const charCode = e.which || e.keyCode;
      const char = String.fromCharCode(charCode);
      
      if (
        charCode === 8 || 
        charCode === 9 || 
        charCode === 27 || 
        charCode === 13 ||
        (charCode === 46 && e.currentTarget.value.indexOf('.') === -1) ||
        (charCode === 45 && e.currentTarget.selectionStart === 0)
      ) {
        return;
      }
      
      if (!/^\d$/.test(char)) {
        e.preventDefault();
      }
    }

    if (type === 'email' && e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${labelPadding}`}
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
          {maxLength && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              (máx. {maxLength} caracteres)
            </span>
          )}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed ${
          hasError 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        {...register(name, {
          ...validationRules,
          required: isRequired ? 'Este campo es obligatorio' : false,
        })}
        onInput={handleInput}
        onKeyPress={handleKeyPress}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-500">
          {fieldError.message as string}
        </p>
      )}
    </div>
  );
};
