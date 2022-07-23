import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isValid: boolean;
  isLoading: boolean;
}
const Button: React.FC<ButtonProps> = ({
  children,
  isValid,
  isLoading,
  ...props
}) => {
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
        'h-10 bg-blue-500 min-w-full rounded-md flex justify-center gap-2 items-center' +
        (isValid ? '' : ' opacity-60 hover:cursor-not-allowed')
      }
    >
      {isLoading && <LoadingSpinner />}
      {<p>{children}</p>}
    </button>
  );
};

export default Button;
