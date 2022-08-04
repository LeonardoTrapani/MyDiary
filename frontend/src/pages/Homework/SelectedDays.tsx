import React from 'react';
import { useAppSelector } from '../../utilities/hooks';

import styles from './Homework.module.css';
const SelectedDays: React.FC = () => {
  const timeToAssign = useAppSelector(
    (state) => state.createHomework.homeworkCreating?.timeToAssign
  );
  const selectedDays = useAppSelector(
    (state) => state.createHomework.selectedDays
  );
  const selectedDaysJsx = selectedDays.map((selectedDay) => {
    return (
      <div key={selectedDay.date}>
        <br />
        <p>{selectedDay.date}</p>
        <p>{selectedDay.freeMinutes}</p>
        <p>Assigned Time: {selectedDay.assignedTime}</p>
        <br />
      </div>
    );
  });
  return (
    <div className={styles['selected-days']}>
      <p>Time to assign: {timeToAssign}</p>
      {selectedDaysJsx}
    </div>
  );
};

export default SelectedDays;
