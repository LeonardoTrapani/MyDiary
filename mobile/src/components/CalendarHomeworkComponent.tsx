import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  DueCalendarDayType,
  HomeScreenStackParamList,
  PlannedCalendarDayType,
  PlannedHomeworkStackParamList,
  RootStackParamList,
} from "../../types";
import { BoldText, MediumText, RegularText } from "../components/StyledText";
import { View } from "../components/Themed";
import { useValidToken } from "../util/react-query-hooks";
import ErrorComponent from "../components/ErrorComponent";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import DateTimePicker from "react-native-modal-datetime-picker";
import { completeHomework, completePlannedDate } from "../api/homework";
import { useAtom } from "jotai";
import { activeInfoDayAtom } from "../util/atoms";

export const CalendarHomeworkComponent: React.FC<{
  date?: string;
  navigation:
    | NativeStackNavigationProp<
        PlannedHomeworkStackParamList,
        "Root",
        undefined
      >
    | NativeStackNavigationProp<HomeScreenStackParamList, "Root", undefined>;
  planned: boolean;
  queryPlannedCalendarDayResult?: UseQueryResult<
    PlannedCalendarDayType,
    unknown
  >;
  queryDueCalendarDayResult?: UseQueryResult<DueCalendarDayType, unknown>;
  setCurrentCalendarDate: React.Dispatch<React.SetStateAction<string>>;
  currentCalendarDate: string;
}> = (props) => {
  useEffect(() => {
    if (props.date) {
      props.setCurrentCalendarDate(props.date);
    }
  }, [props, props.date]);

  return (
    <View style={styles.container}>
      <MyHomeworkHeader
        onToday={() => {
          props.setCurrentCalendarDate(moment().startOf("day").toISOString());
        }}
        onPageForward={() => {
          props.setCurrentCalendarDate((prev) => {
            return moment(prev).startOf("day").add(1, "day").toISOString();
          });
        }}
        onPageBackward={() => {
          props.setCurrentCalendarDate((prev) =>
            moment(prev).startOf("day").subtract(1, "day").toISOString()
          );
        }}
        onSetCalendarDate={(date: string) => props.setCurrentCalendarDate(date)}
        currentCalendarDate={props.currentCalendarDate}
      />
      <>
        <View style={[styles.homeworkBodyContainer]}>
          {props.planned && props.queryPlannedCalendarDayResult ? (
            <PlannedHomeworkBody
              currentDate={props.currentCalendarDate}
              plannedQueryResult={props.queryPlannedCalendarDayResult}
              setCurrentCalendarDate={props.setCurrentCalendarDate}
            />
          ) : !props.planned && props.queryDueCalendarDayResult ? (
            <HomeHomeworkBody
              currentDate={props.currentCalendarDate}
              queryDueCalendarDayResult={props.queryDueCalendarDayResult}
            />
          ) : (
            <></>
          )}
        </View>
      </>
    </View>
  );
};

const MyHomeworkHeader: React.FC<{
  onToday: () => void;
  onSetCalendarDate: (date: string) => void;
  currentCalendarDate: string;
  onPageForward: () => void;
  onPageBackward: () => void;
}> = (props) => {
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);

  const onShowCalendar = () => {
    setIsCalendarOpened(true);
  };

  const { primary } = useTheme().colors;

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onShowCalendar}>
          <BoldText style={[styles.bigDate, { color: primary }]}>
            {moment(props.currentCalendarDate).toDate().toDateString()}
          </BoldText>
        </TouchableOpacity>
        <View style={styles.navigationContainer}>
          <HeaderNavigation
            date={moment(props.currentCalendarDate).toDate()}
            onPageForward={props.onPageForward}
            onPageBackward={props.onPageBackward}
            onToday={props.onToday}
          />

          <DateTimePicker
            date={moment(props.currentCalendarDate).toDate()}
            mode="date"
            isVisible={isCalendarOpened}
            onConfirm={(date) => {
              setIsCalendarOpened(false);
              props.onSetCalendarDate(
                moment(date).startOf("day").toISOString()
              );
            }}
            onCancel={() => {
              setIsCalendarOpened(false);
            }}
          />
        </View>
      </View>
    </>
  );
};

const HomeHomeworkBody: React.FC<{
  currentDate: string;
  queryDueCalendarDayResult: UseQueryResult<DueCalendarDayType, unknown>;
}> = (props) => {
  const { data: validToken } = useValidToken();

  const {
    data: homeworkList,
    error,
    isError,
    isLoading: isCalendarDayLoading,
  } = props.queryDueCalendarDayResult;

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
      return completePlannedDate(data.id, validToken, false);
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
    const completedHomework = homeworkList?.filter(
      (hmk) => hmk.completed === true
    );
    const notCompletedHomework = homeworkList?.filter((hmk) => {
      return hmk.completed === false;
    });
    return [...(notCompletedHomework || []), ...(completedHomework || [])];
  }, [homeworkList]);

  if (homeworkList) {
    return <></>;
  }

  const completeHandler = (id: number) => {
    completeHomeworkMutation.mutate({ id });
  };

  const uncompleteHandler = (id: number) => {
    uncompleteHomeworkMutation.mutate({ id });
  };

  const calendarDayError = error as Error;

  return (
    <View style={{ flex: 1 }}>
      {isCalendarDayLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ErrorComponent text={calendarDayError.message} />
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

const PlannedHomeworkBody: React.FC<{
  currentDate: string;
  plannedQueryResult: UseQueryResult<PlannedCalendarDayType, unknown>;
  setCurrentCalendarDate: React.Dispatch<React.SetStateAction<string>>;
}> = (props) => {
  const {
    data: calendarDay,
    error,
    isError,
    isLoading: isCalendarDayLoading,
    isFetching: isCalendarDayFetching,
  } = props.plannedQueryResult;

  const [, setActiveInfoDay] = useAtom(activeInfoDayAtom);

  const [minutesToComplete, setMinutesToComplete] = useState(0);

  useEffect(() => {
    if (!calendarDay) {
      return;
    }
    const locMinsToComplete = calendarDay.user.homework.reduce((prev, curr) => {
      if (curr.plannedDates[0].completed === true) {
        return prev + 0;
      }
      return prev + curr.plannedDates[0].minutesAssigned;
    }, 0);
    setMinutesToComplete(locMinsToComplete);
  }, [calendarDay]);

  useEffect(() => {
    if (!calendarDay) {
      return;
    }
    setActiveInfoDay({
      date: calendarDay.date,
      initialFreeTime: calendarDay.freeMins,
      minutesToAssign: calendarDay.minutesToAssign,
      minutesToComplete: minutesToComplete,
    });
  }, [calendarDay, minutesToComplete, setActiveInfoDay]);

  useEffect(() => {
    if (!calendarDay || isCalendarDayFetching) {
      return;
    }
    if (moment(props.currentDate).isSame(calendarDay.date, "days")) {
      return;
    }
    console.warn("SERVER DATE IS DIFFERENT FROM LOCAL DATE: ", {
      current: moment(props.currentDate).toDate(),
      server: calendarDay.date,
    });
    props.setCurrentCalendarDate(calendarDay.date);
  }, [calendarDay, isCalendarDayFetching, props]);

  const { data: validToken } = useValidToken();

  const qc = useQueryClient();
  const completeHomeworkMutation = useMutation(
    (data: { id: number }) => {
      return completePlannedDate(data.id, validToken, true);
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
      return completePlannedDate(data.id, validToken, false);
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
    const completedHomework = calendarDay?.user.homework.filter(
      (hmk) => hmk.plannedDates[0].completed === true
    );
    const notCompletedHomework = calendarDay?.user.homework.filter((hmk) => {
      return hmk.plannedDates[0].completed === false;
    });
    return [...(notCompletedHomework || []), ...(completedHomework || [])];
  }, [calendarDay?.user.homework]);

  if (!calendarDay) {
    return <></>;
  }

  const completeHandler = (id: number) => {
    completeHomeworkMutation.mutate({ id });
  };

  const uncompleteHandler = (id: number) => {
    uncompleteHomeworkMutation.mutate({ id });
  };

  const calendarDayError = error as Error;

  return (
    <View style={{ flex: 1 }}>
      {isCalendarDayLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ErrorComponent text={calendarDayError.message} />
      ) : (
        <FlatList
          data={sortedHomeworkList}
          ItemSeparatorComponent={() => (
            <View style={{ marginBottom: 6, marginLeft: 40 }}></View>
          )}
          renderItem={({ item, index }) => (
            <CalendarDayHomework
              homework={item}
              i={index}
              onComplete={completeHandler}
              onUncomplete={uncompleteHandler}
            />
          )}
        />
      )}
    </View>
  );
};

const CalendarDayHomework: React.FC<{
  homework: {
    completed: boolean;
    id: number;
    name: string;
    subject: {
      id: number;
      name: string;
      color: string;
    };
    plannedDates: {
      date: string;
      id: number;
      completed: boolean;
      minutesAssigned: number;
    }[];
    description: string;
    expirationDate: string;
    duration: number;
  };
  i: number;
  onComplete: (id: number) => void;
  onUncomplete: (id: number) => void;
}> = (props) => {
  if (props.homework.plannedDates.length > 1) {
    console.warn(
      "planned dates length is more than 1? ",
      props.homework.plannedDates
    );
  }
  const navigation =
    useNavigation<NavigationProp<PlannedHomeworkStackParamList>>();
  const completeHandler = () => {
    setIsLoading(true);
    props.onComplete(props.homework.plannedDates[0].id);
  };

  const uncompleteHandler = () => {
    setIsLoading(true);
    props.onUncomplete(props.homework.plannedDates[0].id);
  };

  const isCompleted = props.homework.plannedDates[0].completed;

  const [isLoading, setIsLoading] = useState(false);
  return (
    <View>
      <View style={styles.calendarDayHomeworkContainer}>
        {isCompleted ? (
          <UncompleteTick
            color={props.homework.subject.color}
            isLoading={isLoading}
            onUncomplete={uncompleteHandler}
          />
        ) : (
          <CompleteCircle
            onComplete={completeHandler}
            isLoading={isLoading}
            color={props.homework.subject.color}
          />
        )}
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() =>
            navigation.navigate("SingleHomework", {
              homeworkId: props.homework.id,
              title: props.homework.name,
            })
          }
        >
          <MediumText style={styles.homeworkText}>
            {props.homework.name}
          </MediumText>
          {!isCompleted ? (
            <RegularText>
              {minutesToHoursMinutesFun(
                props.homework.plannedDates[0].minutesAssigned
              )}
            </RegularText>
          ) : (
            <></>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UncompleteTick: React.FC<{
  onUncomplete: () => void;
  color: string;
  isLoading: boolean;
}> = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onUncomplete}
      style={[
        {
          alignSelf: "center",
          marginHorizontal: 10,
          height: 22,
          aspectRatio: 1,
          borderRadius: 1000,
          backgroundColor: "#888",
          borderColor: "#888",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    ></TouchableOpacity>
  );
};

const CompleteCircle: React.FC<{
  onComplete: () => void;
  color: string;
  isLoading: boolean;
}> = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onComplete}
      style={[
        {
          alignSelf: "center",
          marginHorizontal: 10,
          height: 22,
          aspectRatio: 1,
          borderRadius: 1000,
          //borderColor: props.color,
          borderColor: "#888",
          borderWidth: 1.4,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    ></TouchableOpacity>
  );
};
const HeaderNavigation: React.FC<{
  date: Date;
  onPageForward: () => void;
  onPageBackward: () => void;
  onToday: () => void;
}> = (props) => {
  return (
    <View style={[styles.dateChangeButton]}>
      <DateChangeBack onPress={props.onPageBackward} />
      <DateToToday onPress={props.onToday} />
      <DateChangeFront onPress={props.onPageForward} />
    </View>
  );
};

const DateToToday: React.FC<{
  onPress: () => void;
}> = (props) => {
  const { primary } = useTheme().colors;
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Ionicons name="pin-sharp" size={24} color={primary} />
    </TouchableOpacity>
  );
};

const DateChangeBack: React.FC<{
  onPress: () => void;
}> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Ionicons name="ios-chevron-back" size={34} />
    </TouchableOpacity>
  );
};

const DateChangeFront: React.FC<{ onPress: () => void }> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Ionicons name="ios-chevron-forward" size={34} />
    </TouchableOpacity>
  );
};

export const AddHomeworkIcon: React.FC = () => {
  const { primary } = useTheme().colors;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("AddHomework");
      }}
    >
      <Ionicons name="add" color={primary} size={28} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateChangeButton: {
    height: 32,
    marginVertical: 10,
    borderRadius: 10000,
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateChangeDateText: {
    textAlign: "center",
    fontSize: 16,
  },
  dateChangeContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  homeworkBodyContainer: {
    flex: 1,
  },
  homeworkText: {
    fontSize: 15,
  },
  headerContainer: {
    padding: 10,
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    width: 50,
  },
  subheaderRight: {
    marginRight: 10,
  },
  headerleft: {
    marginLeft: 10,
  },
  bigDate: {
    fontSize: 28,
    letterSpacing: -0.8,
  },
  calendarDayHomeworkContainer: {
    flexDirection: "row",
    paddingBottom: 5,
  },
  homeworkListSectionHeader: {
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingBottom: 3,
  },

  homeworkListSectionHeaderText: {
    fontSize: 17,
    opacity: 0.8,
  },
});

export default CalendarHomeworkComponent;
