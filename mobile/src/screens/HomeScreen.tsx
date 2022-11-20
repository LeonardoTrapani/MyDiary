import React, { useState } from "react";
import CalendarHomeworkComponent from "../components/CalendarHomeworkComponent";
import { HomeScreenProps } from "../../types";
import { useDueCalendarDay } from "../util/react-query-hooks";
import moment from "moment";

export default function HomeScreen({
  navigation,
  route,
}: HomeScreenProps<"Root">) {
  const initialDate = moment().startOf("day").toISOString();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(initialDate);
  const queryDueCalendarDayResult = useDueCalendarDay(
    moment(currentCalendarDate)
  );

  return (
    <CalendarHomeworkComponent
      navigation={navigation}
      date={route.params?.date}
      planned={false}
      queryDueCalendarDayResult={queryDueCalendarDayResult}
      currentCalendarDate={currentCalendarDate}
      setCurrentCalendarDate={setCurrentCalendarDate}
    />
  );
}
