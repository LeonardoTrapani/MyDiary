import React from 'react';
import { useAppSelector } from '../../utilities/hooks';

import styles from './Homework.module.css';
const SelectedDays: React.FC = () => {
  const timeToAssign = useAppSelector(
    (state) => state.createHomework.homeworkCreating?.timeToAssign
  );
  const selectedDaysJsx = <div></div>; //FREE DAYS WGERE ASSIGNED TIME > 0
  return (
    <div className={styles['selected-days']}>
      <p>Time to assign: {timeToAssign}</p>
      {selectedDaysJsx}
    </div>
  );
};

export default SelectedDays;
