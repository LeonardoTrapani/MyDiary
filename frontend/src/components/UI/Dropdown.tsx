import React, { useRef, useState } from 'react';
import { ActionMeta, GroupBase, SingleValue, StylesConfig } from 'react-select';
import ReactSelect from 'react-select/creatable';

import styles from './Dropdown.module.css';

const Dropdown: React.FC<{
  hasError: boolean;
  parentClassName?: string;
  name: string;
  errorMessage: string;
  childClassName?: string;
  options: {
    value: string;
    label: string;
  }[];
  colors: string[];
  onChange: (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => void;
  onBlur: () => void;
  onCreateOption: (inputValue: string) => void;
}> = (props) => {
  const customStyles: StylesConfig<
    {
      value: string;
      label: string;
    },
    false,
    GroupBase<{
      value: string;
      label: string;
    }>
  > = {
    container: (provided) => {
      return {
        ...provided,
        border: !props.hasError ? '1px solid #000' : '1px solid #dd4848',
        boxSizing: 'border-box',
      };
    },
    control: (provided) => {
      return {
        ...provided,
        cursor: 'text',
        background: '#fff',
        borderRadius: 'none',
        margin: 'none',
        border: 'none',
        minHeight: 'none',
        height: '2.3rem',
        width: '100%',
        padding: '0 0.5rem',
        boxShadow: 'none',
      };
    },
    placeholder: () => {
      return { display: 'none' };
    },
    input: (provided) => {
      return {
        ...provided,
        color: !props.hasError ? '' : '#dd4848',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        transform: 'translate(-7.5%, 0)',
        alignItems: 'center',
        padding: '0 1rem',
      };
    },
    option: (provided) => {
      return {
        ...provided,
        cursor: 'pointer',
      };
    },
    singleValue: (provided, state) => {
      const color = props.colors[+state.data.value];
      return {
        ...provided,
        padding: '0.2rem 0',
        marginLeft: 'none',
        transform: 'translate(-1%, 0)',
        color: color,
      };
    },
  };
  const [creating, setCreating] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectRef = useRef<any>();
  return (
    <div
      className={
        styles['dropdown-container'] +
        ' ' +
        (props.hasError ? styles.error : '') +
        ' ' +
        props.parentClassName
      }
    >
      <div className={styles['title-container']}>
        <label htmlFor={props.name} className={styles.label}>
          {props.name}
        </label>
        {props.hasError && (
          <p className={styles['error-text']}>{props.errorMessage}</p>
        )}
      </div>
      <ReactSelect
        ref={selectRef}
        options={props.options}
        styles={customStyles}
        onChange={props.onChange}
        onBlur={() => {
          if (creating) {
            props.onBlur;
          }
        }}
        onCreateOption={(inputVal) => {
          setCreating(true);
          selectRef.current.blur();
          props.onCreateOption(inputVal);
          setCreating(false);
        }}
      />
    </div>
  );
};

export default Dropdown;
