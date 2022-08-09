import React, { useEffect, useMemo, useRef } from 'react';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  fetchCalendar,
  CalendarDayType,
  CalendarHomeworkType,
} from '../../store/calendar-slice';
import styles from './Calendar.module.css';
import {
  useAppDispatch,
  useAppSelector,
  useFetchAuthorized,
} from '../../utilities/hooks';
import { CircularSmallButton } from '../Homework/FreeDays';
import Button from '../../components/UI/Button';
import { BAR_OPACITY, MONTHS } from '../../utilities/contants';
import { addOpacity } from '../../utilities/utilities';

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
    <div className={styles['calendar-page']}>
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
      <main className={styles['calendar-container']}>
        <DayTitles />
        <ul className={styles.calendar}>{calendarJsx}</ul>
      </main>
    </div>
  );
};

const CalendarDay: React.FC<{
  day: CalendarDayType;
}> = ({ day }) => {
  const calendarHomeworkRef = useRef<HTMLLIElement>(null);

  const totalMinutes = useMemo(() => {
    const totalMinsOccupied = day.homework.reduce(
      (prev, curr) => prev + curr.minutesOccupied,
      0
    );
    return totalMinsOccupied + day.freeTime;
  }, [day.freeTime, day.homework]);

  return (
    <li
      ref={calendarHomeworkRef}
      className={
        styles['calendar-day'] +
        ' ' +
        styles['calendar-day'] +
        ' ' +
        (day.disabled || (day.freeTime === 0 && !day.homework.length)
          ? styles.disabled
          : '')
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
      <CalendarHomework day={day} totalMinutes={totalMinutes} />
    </li>
  );
};

const CalendarHomework: React.FC<{
  day: CalendarDayType;

  totalMinutes: number;
}> = ({ day, totalMinutes }) => {
  return (
    <div className={styles['calendar-homework']}>
      {day.homework.map((hmk) => {
        return (
          <HomeworkBar
            key={hmk.homeworkId}
            homework={hmk}
            totalMinutes={totalMinutes}
          />
        );
      })}
      <FreeTimeBar
        freeMinutes={day.freeTime}
        color='#000'
        totalMinutes={totalMinutes}
      />
    </div>
  );
};

const HomeworkBar: React.FC<{
  homework: CalendarHomeworkType;
  totalMinutes: number;
}> = ({ homework, totalMinutes }) => {
  if (homework.minutesOccupied === 0 || totalMinutes === 0) {
    return <></>;
  }
  const heightPercentage = (homework.minutesOccupied / totalMinutes) * 100;
  return (
    <div
      className={styles.bar}
      style={{
        height: `${heightPercentage}%`,
        backgroundColor: addOpacity(homework.subjectColor, BAR_OPACITY),
      }}
    />
  );
};

const FreeTimeBar: React.FC<{
  color: string;
  totalMinutes: number;
  freeMinutes: number;
}> = ({ totalMinutes, freeMinutes }) => {
  if (freeMinutes === 0) {
    return <></>;
  }
  const heightPercentage = (freeMinutes / totalMinutes) * 100;
  return (
    <div
      style={{
        height: `${heightPercentage}%`,
        backgroundColor: '#fff',
      }}
    />
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
