import moment from "moment";
import { useEffect, useState } from "react";
import { useDueCalendarDay, usePlannedCalendarDay } from "./react-query-hooks";

const useCalendarDay = (
  delay: number,
  isPlans: boolean,
  newDate: string | undefined
) => {
  const initialDate = moment().startOf("day").toISOString();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(initialDate);
  const [delayedCalendarDate, setDelayedCalendarDate] = useState(initialDate);
  const [isLoadingShown, setIsLoadingShown] = useState(false);

  useEffect(() => {
    if (newDate) {
      setCurrentCalendarDate(newDate);
    }
  }, [newDate]);

  const plannedQueryResponse = usePlannedCalendarDay(
    moment(delayedCalendarDate),
    isPlans
  );
  const dueQueryResponse = useDueCalendarDay(
    moment(delayedCalendarDate),
    !isPlans
  );
  const queryResponse = isPlans ? plannedQueryResponse : dueQueryResponse;

  const parsedError = queryResponse.error as Error | undefined;

  useEffect(() => {
    if (!queryResponse || !queryResponse.data || queryResponse.isFetching) {
      return;
    }
    if (moment(delayedCalendarDate).isSame(queryResponse.data.date)) {
      return;
    }
    console.warn("SERVER DATE IS DIFFERENT FROM LOCAL DATE: ", {
      current: moment(delayedCalendarDate).toDate(),
      server: queryResponse.data.date,
    });
    setCurrentCalendarDate(queryResponse.data.date.toString());
  }, [delayedCalendarDate, queryResponse]);

  const onToday = () => {
    setCurrentCalendarDate(moment().startOf("day").toISOString());
  };
  const onPageForward = () => {
    setCurrentCalendarDate((prev) => {
      return moment(prev).startOf("day").add(1, "day").toISOString();
    });
  };
  const onPageBackward = () => {
    setCurrentCalendarDate((prev) =>
      moment(prev).startOf("day").subtract(1, "day").toISOString()
    );
  };
  const onSetCalendarDate = (date: string) => {
    setCurrentCalendarDate(date);
  };

  useEffect(() => {
    setIsLoadingShown(true);
    const timeout = setTimeout(() => {
      setDelayedCalendarDate(currentCalendarDate);
      setIsLoadingShown(false);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [currentCalendarDate, delay]);
  return {
    isLoadingShown,
    delayedCalendarDate,
    parsedError,
    plannedQueryResponse,
    dueQueryResponse,
    onToday,
    onPageBackward,
    onPageForward,
    onSetCalendarDate,
    currentCalendarDate,
  };
};

export default useCalendarDay;
