import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
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
import DateTimePicker from "react-native-modal-datetime-picker";
import { BoldText, RegularText } from "../components/StyledText";
import { View } from "../components/Themed";
import { useCalendarDay, useValidToken } from "../util/react-query-hooks";
import ErrorComponent from "../components/ErrorComponent";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MyDurationPicker from "../components/MyDurationPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editDay } from "../api/day";

const HomeScreen = ({ navigation, route }: HomeStackScreenProps<"Root">) => {
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);

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
        onShowCalendar={() => setIsCalendarOpened(true)}
        onPageBackward={() => {
          setCurrentCalendarDate((prev) =>
            moment(prev).startOf("day").subtract(1, "day").toISOString()
          );
        }}
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
            <DateTimePicker
              date={moment(currentCalendarDate).toDate()}
              mode="date"
              isVisible={isCalendarOpened}
              onConfirm={(date) => {
                setIsCalendarOpened(false);
                setCurrentCalendarDate(
                  moment(date).startOf("day").toISOString()
                );
              }}
              onCancel={() => {
                setIsCalendarOpened(false);
              }}
            />
          </>
        )
      )}
    </View>
  );
};

const MyHomeworkHeader: React.FC<{
  onToday: () => void;
  currentCalendarDate: string;
  onShowCalendar: () => void;
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

  return (
    <>
      <View style={styles.headerContainer}>
        <BoldText style={styles.bigDate}>
          {moment(props.currentCalendarDate).toDate().toDateString()}
        </BoldText>
        <View style={styles.navigationContainer}>
          <HeaderNavigation
            date={moment(props.currentCalendarDate).toDate()}
            onShowCalendar={props.onShowCalendar}
            onPageForward={props.onPageForward}
            onPageBackward={props.onPageBackward}
            onToday={props.onToday}
          />
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
  if (!props.calendarDay) {
    return <></>;
  }
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={props.calendarDay.user.homework}
        renderItem={({ item, index }) => (
          <CalendarDayHomework
            homework={item}
            freeTime={props.freeTime}
            i={index}
          />
        )}
      />
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
      minutesAssigned: number;
    }[];
    description: string;
    expirationDate: string;
    duration: number;
  };
  freeTime: number;
  i: number;
}> = (props) => {
  if (props.homework.plannedDates.length > 1) {
    console.warn(
      "planned dates length is more than 1? ",
      props.homework.plannedDates
    );
  }
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("SingleHomework", {
          homeworkId: props.homework.id,
          title: props.homework.name,
        })
      }
    >
      <RegularText>{props.homework.name}</RegularText>
    </TouchableOpacity>
  );
};

const HeaderNavigation: React.FC<{
  date: Date;
  onShowCalendar: () => void;
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
      <Ionicons name="ios-add" size={28} color={primary} />
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
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  homeworkText: {
    fontSize: 15,
    marginLeft: 7,
    flex: 1,
    alignSelf: "flex-start",
  },
  homeworkNotCenterText: {
    paddingVertical: 6,
  },
  homeworkCenterText: {
    alignSelf: "center",
  },
  homeworkBar: {
    width: 5,
    borderRadius: 5,
    marginVertical: 2,
  },
  calendarDayHomework: {},
  checkIcon: {
    marginRight: 6,
    marginTop: 0,
  },
  checkIconContainer: {},
  timeBar: {
    width: 2,
    flex: 1,
    backgroundColor: "#aaa",
  },
  timeBarText: {
    color: "#666",
  },
  timeBarContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  headerContainer: {
    padding: 20,
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
});

export default HomeScreen;
