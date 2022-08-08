import React, { useEffect } from 'react';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { fetchCalendar, CalendarDayType } from '../../store/calendar-slice';
import styles from './Calendar.module.css';
import {
  useAppDispatch,
  useAppSelector,
  useFetchAuthorized,
} from '../../utilities/hooks';

const Calendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const fetchAuthorized = useFetchAuthorized();
  const calendar = useAppSelector((state) => state.calendar.calendar);
  const isLoading = useAppSelector((state) => state.calendar.isLoading);
  const hasError = useAppSelector((state) => state.calendar.hasError);

  useEffect(() => {
    dispatch(fetchCalendar(fetchAuthorized, 1));
  }, [dispatch, fetchAuthorized]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (hasError) {
    return <h1>An error has occurred fetching the calendar</h1>;
  }

  const calendarJsx = calendar.map((day) => {
    return <CalendarDay key={day.date} day={day} />;
  });
  return <ul className={styles.calendar}>{calendarJsx}</ul>;
};

const CalendarDay: React.FC<{ day: CalendarDayType }> = ({ day }) => {
  return (
    <li className={styles['calendar-day']}>
      <h3>{new Date(day.date).toDateString()}</h3>
      <p>Free time: {day.freeTime}</p>
      <div>
        {day.homework.map((hmk) => {
          return (
            <div key={hmk.homeworkId}>
              <div>
                <p>{hmk.name}</p>
                <p>{hmk.subject}</p>
                <p>{hmk.minutesOccupied}</p>
              </div>
            </div>
          );
        })}
      </div>
    </li>
  );
};

export default Calendar;
