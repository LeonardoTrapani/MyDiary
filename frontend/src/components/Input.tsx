import React from 'react';
const Input: React.FC<{
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  hasError: boolean;
  errorMessage: string;
  other?: Record<string, never>;
}> = (props) => {
  return (
    <div>
      <label htmlFor={props.name} className='text-black' />
      <input
        className={
          'border rounded p-1 w-96 focus: focus:outline-none min-w-full md:min-w-0 m-b-0' +
          (props.hasError ? ' border-red-500' : ' border-black')
        }
        id={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        {...props.other}
      />
      {props.hasError && <p className='text-red-500'>{props.errorMessage}</p>}
    </div>
  );
};

export default Input;
