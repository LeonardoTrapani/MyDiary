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
  const [page, setPage] = useState(1);
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);

  const addHomeworkHandler = () => {
    navigation.navigate("AddHomework");
  };
  const {
    data: calendarDay,
    error,
    isError,
    isLoading: isCalendarDayLoading,
  } = useCalendarDay(page);

  useEffect(() => {
    if (calendarDay) {
      setCurrentCalendarDate(moment(calendarDay.date));
    }
  }, [calendarDay]);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(moment());

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
              date={currentCalendarDate.toDate()}
              onPageForward={() => {
                setCurrentCalendarDate((prev) => {
                  return prev.add(1, "day");
                });
                setPage((prev) => {
                  return prev + 1;
                });
              }}
              onPageBackward={() => {
                setCurrentCalendarDate((prev) => {
                  return prev.subtract(1, "day");
                });
                setPage((prev) => {
                  return prev - 1;
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
                  const diff = moment(date.dateString).diff(
                    currentCalendarDate,
                    "days"
                  );
                  setCurrentCalendarDate((prev) => {
                    return prev.add(diff, "day");
                  });

                  setPage((prev) => {
                    return prev + diff;
                  });
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
