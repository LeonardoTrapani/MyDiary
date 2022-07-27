import React, { useEffect } from 'react';
import { fetchHomework } from '../store/homework-slice';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';

const HomePage: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token) as string;
  const homework = useAppSelector((state) => state.homework.homework);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchHomework(token));
  }, [token, dispatch]);

  if (!homework.length) {
    return <h1>No homework</h1>;
  }
  console.log(homework);
  const homeworkJSX = homework.map((hmk) => {
    return (
      <li key={hmk.id}>
        <ul>
          <li>{hmk.name}</li>
          <li>{hmk.description}</li>
          <li>{hmk.subject}</li>
          <li>{hmk.plannedDate.toDateString()}</li>
        </ul>
      </li>
    );
  });
  return <ul>{homeworkJSX}</ul>;
};
export default HomePage;
