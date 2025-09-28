import { FieldErrors, FieldValues, UseFormRegister, Path } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  className?: string;
  type?:
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'search';
  labelPadding?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: string | number;
  validationRules?: Record<string, unknown>;
  disabled?: boolean;
  isRequired?: boolean;
  autoComplete?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
