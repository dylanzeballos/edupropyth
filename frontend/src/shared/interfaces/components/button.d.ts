export interface ButtonProps {
  label: string;
  icon1?: React.ElementType;
  icon2?: React.ElementType;
  variantColor?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'cuarternary'
    | 'variantText'
    | 'variantDeactivated';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset' ;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  loadingText?: string;
  size?: 'small' | 'medium' | 'large';
}
