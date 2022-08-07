import React, { useEffect } from 'react';
import { fetchCalendar } from '../../store/calendar-slice';
import { useAppDispatch, useFetchAuthorized } from '../../utilities/hooks';

const Calendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const fetchAuthorized = useFetchAuthorized();
  useEffect(() => {
    dispatch(fetchCalendar(fetchAuthorized, 1));
  }, [dispatch, fetchAuthorized]);
  return <div></div>;
};

export default Calendar;
