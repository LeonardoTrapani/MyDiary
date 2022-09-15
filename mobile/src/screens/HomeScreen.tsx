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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MyDurationPicker from "../components/MyDurationPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editDay } from "../api/day";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import DateTimePicker from "react-native-modal-datetime-picker";
import Break from "../components/Break";
import { completePlannedDate } from "../api/homework";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

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
  const { data: validToken } = useValidToken();

  const queryClient = useQueryClient();
  const editDayMutation = useMutation(
    (dayInfo: { date: string; freeMinutes: number }) => {
      return editDay(dayInfo.date, dayInfo.freeMinutes, validToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["calendarDay"]);
      },
    }
  );

  const [durationPickerVisible, setDurationPickerVisible] = useState(false);
  const minutesAssigned =
    typeof props.freeMinutes !== "undefined" &&
    typeof props.minutesToAssign !== "undefined"
      ? props.freeMinutes - props.minutesToAssign
      : 0;

  const [durationDate, setDurationDate] = useState(
    moment().startOf("day").toDate()
  );

  useEffect(() => {
    if (typeof props.freeMinutes !== "undefined") {
      setDurationDate(
        moment().startOf("day").add(props.freeMinutes, "minutes").toDate()
      );
    }
  }, [props.freeMinutes]);

  const [isCalendarOpened, setIsCalendarOpened] = useState(false);
  const [segmentedControlSelectedIndex, setSegmentedControlSelectedIndex] =
    useState(0);

  const onShowCalendar = () => {
    setIsCalendarOpened(true);
  };

  const { primary } = useTheme().colors;

  return (
    <>
      <SegmentedControl
        style={{ width: 200, alignSelf: "center", marginTop: 10 }}
        values={["diary", "planned"]}
        selectedIndex={segmentedControlSelectedIndex}
      />
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
          {/*for edit day*/}
          <MyDurationPicker
            isVisible={durationPickerVisible}
            date={durationDate}
            minimumTime={minutesAssigned}
            onCancel={() => {
              setDurationPickerVisible(false);
            }}
            onConfirm={(date) => {
              const mins =
                moment(date).get("minutes") + moment(date).get("hours") * 60;
              setDurationDate(date);
              setDurationPickerVisible(false);
              editDayMutation.mutate({
                freeMinutes: mins,
                date: props.currentCalendarDate,
              });
            }}
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
      {editDayMutation.isError && (
        <ErrorComponent text={editDayMutation.error as string} />
      )}
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

  const notCompletedHomework = useMemo(() => {
    return props.calendarDay?.user.homework.filter(
      (hmk) => hmk.plannedDates[0].completed === false
    );
  }, [props.calendarDay?.user.homework]);

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

  //const completedHomework = useMemo(() => {
  //return props.calendarDay?.user.homework.filter(
  //(hmk) => hmk.plannedDates[0].completed === true
  //);
  //}, [props.calendarDay?.user.homework]);

  if (!props.calendarDay) {
    return <></>;
  }

  const completeHandler = (id: number) => {
    completeHomeworkMutation.mutate({ id });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={notCompletedHomework}
          renderItem={({ item, index }) => (
            <CalendarDayHomework
              homework={item}
              i={index}
              onComplete={completeHandler}
              isCompleteLoading={completeHomeworkMutation.isLoading}
            />
          )}
        />
      </View>
    </View>
  );
};
//<FlatList
//data={completedHomework}
//renderItem={({ item, index }) => (
//<CalendarDayHomework homework={item} i={index} />
//)}
///>

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
      minutesAssigned: number;
    }[];
    description: string;
    expirationDate: string;
    duration: number;
  };
  i: number;
  isCompleteLoading: boolean;
  onComplete: (i: number) => void;
}> = (props) => {
  if (props.homework.plannedDates.length > 1) {
    console.warn(
      "planned dates length is more than 1? ",
      props.homework.plannedDates
    );
  }
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const completeHandler = () => {
    props.onComplete(props.homework.plannedDates[0].id);
  };

  return (
    <View>
      <View style={styles.calendarDayHomeworkContainer}>
        <CompleteCircle
          onComplete={() => completeHandler()}
          isLoading={props.isCompleteLoading}
          color={props.homework.subject.color}
        />
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
          <RegularText>
            {minutesToHoursMinutesFun(
              props.homework.plannedDates[0].minutesAssigned
            )}
          </RegularText>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 5, marginLeft: 40 }}>
        <Break />
      </View>
    </View>
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
      style={{
        alignSelf: "center",
        marginHorizontal: 10,
        height: 22,
        aspectRatio: 1,
        borderRadius: 1000,
        borderColor: props.color,
        //borderColor: "#888",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {props.isLoading && <ActivityIndicator />}
    </TouchableOpacity>
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
    <TouchableOpacity style={styles.dateChangeBack} onPress={props.onPress}>
      <Ionicons name="pin-sharp" size={24} color={primary} />
    </TouchableOpacity>
  );
};

const DateChangeBack: React.FC<{
  onPress: () => void;
}> = (props) => {
  return (
    <TouchableOpacity style={styles.dateChangeBack} onPress={props.onPress}>
      <Ionicons name="ios-chevron-back" size={34} />
    </TouchableOpacity>
  );
};

const DateChangeFront: React.FC<{ onPress: () => void }> = (props) => {
  return (
    <TouchableOpacity style={styles.dateChangeFront} onPress={props.onPress}>
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
  dateChangeBack: {},
  dateChangeFront: {},
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
});

export default HomeScreen;
