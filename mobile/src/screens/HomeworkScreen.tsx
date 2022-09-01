import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { RootTabScreenProps } from "../../types";
import FloatingButton from "../components/FloatingButton";
import { RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import globalStyles from "../constants/Syles";
import { useCalendarDay } from "../util/react-query-hooks";
import ErrorComponent from "../components/ErrorComponent";
import { formatCalendarDay } from "../util/generalUtils";
import moment from "moment";

const HomeworkScreen = ({ navigation }: RootTabScreenProps<"Homework">) => {
  const { primary } = useTheme().colors;
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);
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
    console.log(currentCalendarDate);
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
              onPageForward={() => {
                console.log("ADDING ONE DAY");
                setCurrentCalendarDate((prev) => {
                  return moment(prev)
                    .startOf("day")
                    .add(1, "day")
                    .toISOString();
                });
              }}
              onPageBackward={() => {
                console.log("REMOVING ONE DAY");
                setCurrentCalendarDate((prev) => {
                  return moment(prev)
                    .startOf("day")
                    .subtract(1, "day")
                    .toISOString();
                });
              }}
              onToggleCalendar={() => {
                setIsCalendarOpened((prev) => !prev);
              }}
            />
            {isCalendarOpened ? (
              <Calendar
                initialDate={formatCalendarDay(currentCalendarDate)}
                current={formatCalendarDay(currentCalendarDate)}
                onMonthChange={(date) => {
                  setCurrentCalendarDate(moment(date.dateString).toISOString());
                }}
              />
            ) : (
              <HomeworkBody />
            )}
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

const HomeworkBody: React.FC = () => {
  return <View></View>;
};

const DateChangeButton: React.FC<{
  date: Date;
  onToggleCalendar: () => void;
  onPageForward: () => void;
  onPageBackward: () => void;
}> = (props) => {
  return (
    <View style={styles.dateChangeContainer}>
      <TouchableOpacity onPress={props.onToggleCalendar}>
        <CardView style={[styles.dateChangeButton, globalStyles.shadow]}>
          <DateChangeBack onPress={props.onPageBackward} />
          <TouchableOpacity onPress={props.onToggleCalendar}>
            <RegularText style={styles.dateChangeDateText}>
              {props.date.toDateString()}
            </RegularText>
          </TouchableOpacity>
          <DateChangeFront onPress={props.onPageForward} />
        </CardView>
      </TouchableOpacity>
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
});

export default HomeworkScreen;
