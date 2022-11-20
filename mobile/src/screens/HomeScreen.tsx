import React, { useEffect, useMemo, useState } from "react";
import { MyHomeworkHeader } from "../components/CalendarHomeworkComponent";
//import { HomeScreenProps } from "../../types";
import { useDueCalendarDay, useValidToken } from "../util/react-query-hooks";
import moment from "moment";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeHomework } from "../api/homework";
import ErrorComponent from "../components/ErrorComponent";
import { DueCalendarDayType } from "../../types";

export default function HomeScreen() {
  //{
  //navigation,
  //route,
  //}: HomeScreenProps<"Root">
  const initialDate = moment().startOf("day").toISOString();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(initialDate);

  const { data, error, isError, isLoading, isFetching } = useDueCalendarDay(
    moment(currentCalendarDate)
  );
  const parsedError = error as Error | undefined;

  useEffect(() => {
    if (!data || isFetching) {
      return;
    }
    if (moment(currentCalendarDate).isSame(data.date, "days")) {
      return;
    }
    console.warn("SERVER DATE IS DIFFERENT FROM LOCAL DATE: ", {
      current: moment(currentCalendarDate).toDate(),
      server: data.date,
    });
    setCurrentCalendarDate(data.date);
  }, [currentCalendarDate, data, isFetching]);

  return (
    <View style={{ flex: 1 }}>
      <MyHomeworkHeader
        onToday={() => {
          setCurrentCalendarDate(moment().startOf("day").toISOString());
        }}
        onPageForward={() => {
          setCurrentCalendarDate((prev) => {
            return moment(prev).startOf("day").add(1, "day").toISOString();
          });
        }}
        onPageBackward={() => {
          setCurrentCalendarDate((prev) =>
            moment(prev).startOf("day").subtract(1, "day").toISOString()
          );
        }}
        onSetCalendarDate={(date: string) => setCurrentCalendarDate(date)}
        currentCalendarDate={currentCalendarDate}
      />
      <HomeHomeworkBody
        currentDate={currentCalendarDate}
        data={data}
        isError={isError}
        isLoading={isLoading}
        errorMessage={parsedError?.message}
      />
    </View>
  );
}

const HomeHomeworkBody: React.FC<{
  currentDate: string;
  isLoading: boolean;
  data: DueCalendarDayType | undefined;
  errorMessage?: string;
  isError: boolean;
}> = (props) => {
  const { data: validToken } = useValidToken();

  const qc = useQueryClient();
  const completeHomeworkMutation = useMutation(
    (data: { id: number }) => {
      return completeHomework(data.id, validToken, true);
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(["plannedCalendarDay"]);
        qc.invalidateQueries(["dueCalendarDay"]);
        qc.invalidateQueries(["SingleHomework"]);
      },
    }
  );

  const uncompleteHomeworkMutation = useMutation(
    (data: { id: number }) => {
      return completeHomework(data.id, validToken, false);
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(["plannedCalendarDay"]);
        qc.invalidateQueries(["dueCalendarDay"]);
        qc.invalidateQueries(["SingleHomework"]);
      },
    }
  );
  const sortedHomeworkList = useMemo(() => {
    const completedHomework = props.data?.homeworkList.filter(
      (hmk) => hmk.completed === true
    );
    const notCompletedHomework = props.data?.homeworkList.filter((hmk) => {
      return hmk.completed === false;
    });
    return [...(notCompletedHomework || []), ...(completedHomework || [])];
  }, [props.data]);

  if (!props.data) {
    return <></>;
  }

  const completeHandler = (id: number) => {
    completeHomeworkMutation.mutate({ id });
  };

  const uncompleteHandler = (id: number) => {
    uncompleteHomeworkMutation.mutate({ id });
  };

  return (
    <View style={{ flex: 1 }}>
      {props.isLoading ? (
        <ActivityIndicator />
      ) : props.isError ? (
        <ErrorComponent text={props.errorMessage || ""} />
      ) : (
        <FlatList
          data={sortedHomeworkList}
          ItemSeparatorComponent={() => (
            <View style={{ marginBottom: 6, marginLeft: 40 }}></View>
          )}
          renderItem={({ item, index }) => <View></View>}
        />
      )}
    </View>
  );
};
