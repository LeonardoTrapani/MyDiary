const Input: React.FC<{
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  hasError: boolean;
  other?: {};
}> = (props) => {
  const inputClasses =
    'border-2 ' + (props.hasError ? 'border-red-500' : 'border-black');
  return (
    <>
      <label htmlFor={props.name} className='text-black' />
      <input
        className={inputClasses}
        id={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        {...props.other}
      />
    </>
  );
};

export default Input;
