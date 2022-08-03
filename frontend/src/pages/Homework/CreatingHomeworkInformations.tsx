import React from 'react';
import { useAppSelector } from '../../utilities/hooks';
import styles from './Homework.module.css';
const CreatingHomeworkInformations: React.FC = () => {
  const homeworkCreating = useAppSelector(
    (state) => state.createHomework.homeworkCreating
  );
  return (
    <div className={styles['creating-homework-informations--container']}>
      <div>Name: {homeworkCreating?.name}</div>
      <div>Subject: {homeworkCreating?.subject}</div>
      <div>Description: {homeworkCreating?.description}</div>
      <div>Duration: {homeworkCreating?.duration}</div>
      <div>Expiration Date: {homeworkCreating?.expirationDate}</div>
    </div>
  );
};

export default CreatingHomeworkInformations;
