import React from 'react';

import styles from './Slider.module.css';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  step?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Slider: React.FC<SliderProps> = (props) => {
  return (
    <input
      type='range'
      className={styles.slider}
      min='0'
      step={props.step || 1}
      {...props}
    />
  );
};
export default Slider;
