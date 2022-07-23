import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isValid: boolean;
}
const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={'h-10 bg-blue-500 min-w-full rounded-md'}>
      {children}
    </button>
  );
};

export default Button;
