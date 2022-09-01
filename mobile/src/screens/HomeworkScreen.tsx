import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CalendarDayType, RootTabScreenProps } from "../../types";
import FloatingButton from "../components/FloatingButton";
import DateTimePicker from "react-native-modal-datetime-picker";
import { RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import globalStyles from "../constants/Syles";
import { useCalendarDay } from "../util/react-query-hooks";
import ErrorComponent from "../components/ErrorComponent";
import moment from "moment";

const HomeworkScreen = ({ navigation }: RootTabScreenProps<"Homework">) => {
  const { primary } = useTheme().colors;
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);
  const [homeworkBodyHeight, setHomeworkBodyHeight] = useState<
    number | undefined
  >(undefined);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(
    moment().startOf("day").toISOString()
  );

  const addHomeworkHandler = () => {
    navigation.navigate("AddHomework");
  };

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
      {isCalendarDayLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ErrorComponent text={calendarDayError.message} />
      ) : (
        calendarDay && (
          <>
            <DateChangeButton
              date={moment(currentCalendarDate).toDate()}
              onShowCalendar={() => setIsCalendarOpened(true)}
              onPageForward={() => {
                setCurrentCalendarDate((prev) => {
                  return moment(prev)
                    .startOf("day")
                    .add(1, "day")
                    .toISOString();
                });
              }}
              onPageBackward={() => {
                setCurrentCalendarDate((prev) => {
                  return moment(prev)
                    .startOf("day")
                    .subtract(1, "day")
                    .toISOString();
                });
              }}
            />

            <View
              style={[styles.homeworkBodyContainer]}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setHomeworkBodyHeight(height);
              }}
            >
              <HomeworkBody
                calendarDay={calendarDay}
                height={homeworkBodyHeight}
                freeTime={calendarDay.freeMins}
                minutesToAssign={calendarDay.minutesToAssign}
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
      <FloatingButton
        color={primary}
        ionIconName="ios-add"
        onPress={addHomeworkHandler}
      />
    </View>
  );
};

const HomeworkBody: React.FC<{
  calendarDay: CalendarDayType;
  freeTime: number;
  minutesToAssign: number;
  height: number | undefined;
}> = (props) => {
  if (!props.calendarDay || !props.height) {
    return <></>;
  }
  return props.calendarDay.user.homework.length ? (
    <FlatList
      data={props.calendarDay.user.homework}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <CalendarDayHomework
          homework={item}
          freeTime={props.freeTime}
          parentHeight={props.height as number}
        />
      )}
    />
  ) : (
    <View
      style={{
        paddingBottom: 60,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <RegularText style={{ fontSize: 18 }}>No homework yet...</RegularText>
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
  parentHeight: number;
}> = (props) => {
  if (props.homework.plannedDates.length > 1) {
    console.warn(
      "planned dates length is more than 1? ",
      props.homework.plannedDates
    );
  }
  const height =
    (props.parentHeight * props.homework.plannedDates[0].minutesAssigned) /
    props.freeTime;
  return (
    <CardView
      style={[
        {
          backgroundColor: props.homework.subject.color,
          height,
        },
      ]}
    >
      <RegularText>{props.homework.name}</RegularText>
    </CardView>
  );
};

const DateChangeButton: React.FC<{
  date: Date;
  onShowCalendar: () => void;
  onPageForward: () => void;
  onPageBackward: () => void;
}> = (props) => {
  return (
    <View style={styles.dateChangeContainer}>
      <CardView style={[styles.dateChangeButton, globalStyles.shadow]}>
        <DateChangeBack onPress={props.onPageBackward} />
        <TouchableOpacity onPress={props.onShowCalendar}>
          <RegularText style={styles.dateChangeDateText}>
            {props.date.toDateString()}
          </RegularText>
        </TouchableOpacity>
        <DateChangeFront onPress={props.onPageForward} />
      </CardView>
    </View>
  );
};

const DateChangeBack: React.FC<{
  onPress: () => void;
}> = (props) => {
  return (
    <TouchableOpacity style={styles.dateChangeBack} onPress={props.onPress}>
      <Ionicons name="ios-chevron-back" size={22} />
    </TouchableOpacity>
  );
};

const DateChangeFront: React.FC<{ onPress: () => void }> = (props) => {
  return (
    <TouchableOpacity style={styles.dateChangeFront} onPress={props.onPress}>
      <Ionicons name="ios-chevron-forward" size={22} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateChangeButton: {
    height: 40,
    marginVertical: 15,
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
  dateChangeBack: {
    marginRight: 8,
    marginLeft: 4,
  },
  dateChangeFront: {
    marginLeft: 8,
    marginRight: 4,
  },
  homeworkBodyContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default HomeworkScreen;
