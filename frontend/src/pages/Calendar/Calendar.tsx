import React, { useEffect, useMemo } from 'react';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { fetchCalendar, CalendarDayType } from '../../store/calendar-slice';
import styles from './Calendar.module.css';
import {
  useAppDispatch,
  useAppSelector,
  useFetchAuthorized,
} from '../../utilities/hooks';
import { CircularSmallButton } from '../Homework/FreeDays';
import Button from '../../components/UI/Button';
import MinutesToHoursMinutes from '../../components/UI/MinutesFromHoursMinutes';
import { MONTHS } from '../../utilities/contants';

const Calendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const fetchAuthorized = useFetchAuthorized();
  const calendar = useAppSelector((state) => state.calendar.calendar);
  const isLoading = useAppSelector((state) => state.calendar.isLoading);
  const hasError = useAppSelector((state) => state.calendar.hasError);

  useEffect(() => {
    dispatch(fetchCalendar(fetchAuthorized, 1));
  }, [dispatch, fetchAuthorized]);

  const calendarJsx = useMemo(
    () =>
      calendar.map((day) => {
        return <CalendarDay key={day.date} day={day} />;
      }),
    [calendar]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (hasError) {
    return <h1>An error has occurred fetching the calendar</h1>;
  }

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.month}>August</span>{' '}
          <span className={styles.year}>2022</span>
        </h1>
        <nav className={styles.nav}>
          <CircularSmallButton
            disabled={false}
            onClick={() => {
              console.log('nextpage');
            }}
            left
          />
          <Button isLoading={false} isValid={true}>
            Today
          </Button>
          <CircularSmallButton
            disabled={false}
            onClick={() => {
              console.log('nextpage');
            }}
            right
          />
        </nav>
      </header>
      <main>
        <DayTitles />
        <ul className={styles.calendar}>{calendarJsx}</ul>
      </main>
    </>
  );
};

const CalendarDay: React.FC<{ day: CalendarDayType }> = ({ day }) => {
  return (
    <li
      className={
        styles['calendar-day'] + ' ' + (day.disabled ? styles.disabled : '')
      }
    >
      {new Date(day.date).getDate() === 1 ? (
        <h3 className={styles['date-container']}>
          <span className={styles.month}>
            {MONTHS[new Date(day.date).getMonth()]}
          </span>
          <span className={styles.date}>
            &nbsp;{new Date(day.date).getDate()}
          </span>
        </h3>
      ) : (
        <h3 className={styles['date-container']}>
          <span className={styles.date}>{new Date(day.date).getDate()}</span>
        </h3>
      )}

      <div>
        Free time: <MinutesToHoursMinutes minutes={day.freeTime} />
      </div>
      <div>
        {day.homework.map((hmk) => {
          return (
            <div key={hmk.homeworkId}>
              <div>
                <p>{hmk.name}</p>
                <p>{hmk.subjectColor}</p>
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

const DayTitles: React.FC = () => {
  return (
    <nav>
      <ul className={styles.days}>
        <li className={styles['day-title']}>
          <p>Monday</p>
        </li>
        <li className={styles['day-title']}>
          <p>Tuesday</p>
        </li>
        <li className={styles['day-title']}>
          <p>Wednesday</p>
        </li>
        <li className={styles['day-title']}>
          <p>Thursday</p>
        </li>
        <li className={styles['day-title']}>
          <p>Friday</p>
        </li>
        <li className={styles['day-title']}>
          <p>Saturday</p>
        </li>
        <li className={styles['day-title']}>
          <p>Sunday</p>
        </li>
      </ul>
    </nav>
  );
};
export default Calendar;
