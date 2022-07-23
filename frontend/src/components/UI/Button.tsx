import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isValid: boolean;
}
const Button: React.FC<ButtonProps> = ({ children, isValid, ...props }) => {
  const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isValid) {
      event.preventDefault();
    }
  };
  return (
    <button
      {...props}
      onClick={buttonClickHandler}
      className={
        'h-10 bg-blue-500 min-w-full rounded-md ' +
        (isValid ? '' : 'opacity-40 hover:cursor-not-allowed')
      }
    >
      {children}
    </button>
  );
};

export default Button;
