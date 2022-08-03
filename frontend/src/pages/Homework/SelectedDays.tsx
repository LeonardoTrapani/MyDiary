import React from 'react';

import styles from './Homework.module.css';
const SelectedDays: React.FC = () => {
  return (
    <div className={styles['selected-days']}>
      <p>Time to assign:</p>
    </div>
  );
};

export default SelectedDays;
