import { ButtonProps } from '../../interfaces';

export const Button = ({
  type = 'button',
  label,
  icon1: Icon1,
  icon2: Icon2,
  variantColor = 'primary',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  loadingText = 'Cargando...',
}: ButtonProps) => {
  const baseStyles =
    'flex items-center justify-center font-medium rounded focus:outline-none transition duration-150 ease-in-out';

  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const variantStyles = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300',
    secondary:
      'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-300',
    tertiary:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300',
    cuarternary:
      'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:bg-yellow-300',
    variantText:
      'bg-transparent text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-300',
    variantDeactivated: 'bg-gray-200 text-gray-500 cursor-not-allowed',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles.medium} ${
        variantStyles[variantColor]
      } ${className} ${loading ? 'cursor-wait' : ''}`}
    >
      {loading ? (
        <>
          {<span className="animate-spin mr-2">↻</span>}
          <p className="pl-1 text-center text-wrap">{loadingText}</p>
        </>
      ) : (
        <>
          {Icon1 && <Icon1 className="mr-0" />}
          <span>{label}</span>
          <p className="pl-1 text-center text-wrap">{label}</p>
          {Icon2 && <Icon2 className="mr-0" />}
        </>
      )}
    </button>
  );
};
