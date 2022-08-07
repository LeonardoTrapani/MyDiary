import React, { useEffect } from 'react';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { fetchCalendar } from '../../store/calendar-slice';
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

  console.log(isLoading);
  const calendarJsx = calendar.map((day) => {
    return (
      <div key={day.date.toString()}>
        <br />
        <div>
          <p>Date: {day.date.toString()}</p>
          <p>Free time: {day.freeTime}</p>
          <div>
            {day.homework.map((hmk) => {
              return (
                <div key={hmk.homeworkId}>
                  <br />
                  <div>
                    <p>{hmk.name}</p>
                    <p>{hmk.minutesOccupied}</p>
                  </div>
                  <br />
                </div>
              );
            })}
          </div>
        </div>
        <br />
        <br />
        <br />
      </div>
    );
  });
  return <div>{calendarJsx}</div>;
};

export default Calendar;
