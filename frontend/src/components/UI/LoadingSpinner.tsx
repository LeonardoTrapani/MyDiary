import React from 'react';
import styles from './LoadingSpinner.module.css';
const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles['lds-ring']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
