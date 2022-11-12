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
  AddHomeworkStackScreenProps,
  CalendarDayType,
  HomeStackParamList,
  HomeStackScreenProps,
  RootStackParamList,
} from "../../types";
import { BoldText, MediumText, RegularText } from "../components/StyledText";
import { View } from "../components/Themed";
import { useCalendarDay, useValidToken } from "../util/react-query-hooks";
import ErrorComponent from "../components/ErrorComponent";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MyDurationPicker from "../components/MyDurationPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editDay } from "../api/day";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import DateTimePicker from "react-native-modal-datetime-picker";
import { completePlannedDate } from "../api/homework";
import { useAtom } from "jotai";
import { activeInfoDayAtom } from "../util/atoms";
import Break from "../components/Break";

const HomeScreen = ({ navigation, route }: HomeStackScreenProps<"Root">) => {
  const initialDate = moment().startOf("day").toISOString();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(initialDate);

  useEffect(() => {
    if (route.params?.date) {
      setCurrentCalendarDate(route.params.date);
    }
  }, [route.params?.date]);

  const {
    data: calendarDay,
    error,
    isError,
    isLoading: isCalendarDayLoading,
    isFetching: isCalendarDayFetching,
  } = useCalendarDay(moment(currentCalendarDate));

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
    if (moment(currentCalendarDate).isSame(calendarDay.date, "days")) {
      return;
    }
    console.warn("SERVER DATE IS DIFFERENT FROM LOCAL DATE: ", {
      current: moment(currentCalendarDate).toDate(),
      server: calendarDay.date,
    });
    setCurrentCalendarDate(calendarDay.date);
  }, [calendarDay, currentCalendarDate, isCalendarDayFetching]);

  const calendarDayError = error as Error;

  return (
    <View style={styles.container}>
      <MyHomeworkHeader
        navigation={navigation}
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
        freeMinutes={calendarDay?.freeMins}
        minutesToAssign={calendarDay?.minutesToAssign}
      />
      {isCalendarDayLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ErrorComponent text={calendarDayError.message} />
      ) : (
        calendarDay && (
          <>
            <View style={[styles.homeworkBodyContainer]}>
              <HomeworkBody
                calendarDay={calendarDay}
                freeTime={calendarDay.freeMins}
                minutesToAssign={calendarDay.minutesToAssign}
                currentDate={currentCalendarDate}
              />
            </View>
          </>
        )
      )}
    </View>
  );
};

const MyHomeworkHeader: React.FC<{
  onToday: () => void;
  onSetCalendarDate: (date: string) => void;
  currentCalendarDate: string;
  onPageForward: () => void;
  onPageBackward: () => void;
  navigation: NativeStackNavigationProp<HomeStackParamList, "Root", undefined>;
  minutesToAssign: number | undefined;
  freeMinutes: number | undefined;
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

const HomeworkBody: React.FC<{
  calendarDay: CalendarDayType;
  freeTime: number;
  minutesToAssign: number;
  currentDate: string;
}> = (props) => {
  const { data: validToken } = useValidToken();

  const qc = useQueryClient();
  const completeHomeworkMutation = useMutation(
    (data: { id: number }) => {
      return completePlannedDate(data.id, validToken, true);
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(["calendarDay"]);
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
        qc.invalidateQueries(["calendarDay"]);
        qc.invalidateQueries(["SingleHomework"]);
      },
    }
  );
  const sortedHomeworkList = useMemo(() => {
    const completedHomework = props.calendarDay?.user.homework.filter(
      (hmk) => hmk.plannedDates[0].completed === true
    );
    const notCompletedHomework = props.calendarDay?.user.homework.filter(
      (hmk) => {
        return hmk.plannedDates[0].completed === false;
      }
    );
    return [...(notCompletedHomework || []), ...(completedHomework || [])];
  }, [props.calendarDay?.user.homework]);

  if (!props.calendarDay) {
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
      <View style={{ flex: 1 }}>
        <FlatList
          data={sortedHomeworkList}
          ItemSeparatorComponent={() => (
            <View style={{ marginBottom: 5, marginLeft: 40 }}>
              <Break />
            </View>
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
      </View>
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
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
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

export const CalendarDayInfoIcon: React.FC = () => {
  const { primary } = useTheme().colors;

  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Info");
      }}
    >
      <Ionicons name="information-circle-outline" color={primary} size={25} />
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

export const DayInfoModal = ({
  navigation,
}: AddHomeworkStackScreenProps<"info"> | HomeStackScreenProps<"Info">) => {
  const { data: validToken } = useValidToken();

  const queryClient = useQueryClient();
  const editDayMutation = useMutation(
    (dayInfo: { date: string; freeMinutes: number }) => {
      return editDay(dayInfo.date, dayInfo.freeMinutes, validToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["calendarDay"]);
        queryClient.invalidateQueries(["freeDays"]);
        navigation.pop();
      },
    }
  );

  const [activeInfoDay] = useAtom(activeInfoDayAtom);

  const [freeTimeDurationPickerVisible, setFreeTimeDurationPickerVisible] =
    useState(false);

  const [
    minutesToAssignDurationPickerVisible,
    setMinutesToAssignDurationPickerVisible,
  ] = useState(false);

  const assignedMinutes =
    typeof activeInfoDay !== "undefined"
      ? activeInfoDay.initialFreeTime - activeInfoDay.minutesToAssign
      : 0;

  const freeTimeMinimumTime = assignedMinutes;

  const [freeTimeDurationDate, setFreeTimeDurationDate] = useState(
    moment().startOf("day").toDate()
  );

  const [minutesToAssignDurationDate, setMinutesToAssignDurationDate] =
    useState(moment().startOf("day").toDate());

  useEffect(() => {
    if (typeof activeInfoDay !== "undefined") {
      setFreeTimeDurationDate(
        moment()
          .startOf("day")
          .add(activeInfoDay.initialFreeTime, "minutes")
          .toDate()
      );
      setMinutesToAssignDurationDate(
        moment()
          .startOf("day")
          .add(activeInfoDay.minutesToAssign, "minutes")
          .toDate()
      );
    }
  }, [activeInfoDay]);

  if (!activeInfoDay) {
    return <ErrorComponent text="an error has occurred: day does not exist" />;
  }

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <BoldText
        style={{
          fontSize: 30,
        }}
      >
        {new Date(activeInfoDay.date).toDateString()}
      </BoldText>

      <View style={{ marginVertical: 10 }}>
        {activeInfoDay.minutesToComplete ? (
          <InfoRow
            left="Minutes to complete"
            right={minutesToHoursMinutesFun(activeInfoDay.minutesToComplete)}
          />
        ) : (
          <></>
        )}
        <InfoRow
          left="Minutes to assign"
          right={minutesToHoursMinutesFun(activeInfoDay.minutesToAssign)}
          rightPressable={true}
          onRightPressed={() => {
            setMinutesToAssignDurationPickerVisible(true);
          }}
        />
        <InfoRow
          left="Initial Free Time"
          right={minutesToHoursMinutesFun(activeInfoDay.initialFreeTime)}
          rightPressable={true}
          onRightPressed={() => {
            setFreeTimeDurationPickerVisible(true);
          }}
        />
      </View>

      <MyDurationPicker
        isVisible={freeTimeDurationPickerVisible}
        date={freeTimeDurationDate}
        minimumTime={freeTimeMinimumTime}
        onCancel={() => {
          setFreeTimeDurationPickerVisible(false);
        }}
        onConfirm={(date) => {
          const mins =
            moment(date).get("minutes") + moment(date).get("hours") * 60;
          setFreeTimeDurationDate(date);
          setFreeTimeDurationPickerVisible(false);
          editDayMutation.mutate({
            freeMinutes: mins,
            date: activeInfoDay.date,
          });
        }}
      />

      <MyDurationPicker
        isVisible={minutesToAssignDurationPickerVisible}
        date={minutesToAssignDurationDate}
        maximumTime={1439 - assignedMinutes}
        onCancel={() => {
          setMinutesToAssignDurationPickerVisible(false);
        }}
        onConfirm={(date) => {
          const mins =
            moment(date).get("minutes") +
            moment(date).get("hours") * 60 +
            assignedMinutes;
          setMinutesToAssignDurationDate(date);
          setMinutesToAssignDurationPickerVisible(false);
          editDayMutation.mutate({
            freeMinutes: mins,
            date: activeInfoDay.date,
          });
        }}
      />
    </View>
  );
};

const InfoRow: React.FC<{
  left?: string;
  right?: string;
  rightPressable?: boolean;
  onRightPressed?: () => void;
}> = (props) => {
  const { primary } = useTheme().colors;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        justifyContent: "space-between",
      }}
    >
      <RegularText style={{ fontSize: 17 }}>{props.left}</RegularText>
      {!props.rightPressable ? (
        <RegularText style={{ fontSize: 17, color: primary }}>
          {props.right}
        </RegularText>
      ) : (
        <TouchableOpacity onPress={props.onRightPressed}>
          <MediumText style={{ fontSize: 17, color: primary }}>
            {props.right}
          </MediumText>
        </TouchableOpacity>
      )}
    </View>
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

export default HomeScreen;
