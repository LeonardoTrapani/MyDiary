import React from 'react';
import styles from './LoadingSpinner.module.css';
const LoadingSpinner: React.FC<{
  center?: true;
}> = () => {
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
