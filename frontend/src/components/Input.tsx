const Input: React.FC<{
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  other?: {};
}> = (props) => {
  return (
    <>
      <label htmlFor={props.name} />
      <input
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
