import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
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
import { MINIMUM_HOMEWORK_HEIGHT } from "../constants/constants";

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

  const [totalHeight, setTotalHeight] = useState(0);
  const { heights, totalHeight: funcTotalHeight } = useMemo(() => {
    return calculateHeights(
      calendarDay,
      homeworkBodyHeight,
      {},
      MINIMUM_HOMEWORK_HEIGHT
    );
  }, [calendarDay, homeworkBodyHeight]);

  useEffect(() => {
    setTotalHeight(funcTotalHeight);
  }, [funcTotalHeight]);

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
                freeTime={calendarDay.freeMins}
                heights={heights}
                totalHeight={totalHeight}
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
  heights: number[];
  totalHeight: number;
}> = (props) => {
  if (!props.calendarDay || !props.heights) {
    return <></>;
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: props.totalHeight }}>
        <FlatList
          data={props.calendarDay.user.homework}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <CalendarDayHomework
              homework={item}
              freeTime={props.freeTime}
              height={props.heights[index]}
            />
          )}
        />
      </View>
      <FreeTimeComponent />
    </View>
  );
};

const FreeTimeComponent: React.FC = () => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <HorizontalBar color="#aaa" />
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
  height: number;
}> = (props) => {
  if (props.homework.plannedDates.length > 1) {
    console.warn(
      "planned dates length is more than 1? ",
      props.homework.plannedDates
    );
  }
  return (
    <View
      style={[
        {
          flexDirection: "row",
          height: props.height,
        },
      ]}
    >
      <HorizontalBar color={props.homework.subject.color} />
      <RegularText>{props.homework.name}</RegularText>
    </View>
  );
};

const HorizontalBar: React.FC<{ color: string }> = (props) => {
  return (
    <View
      style={{
        backgroundColor: props.color,
        width: 7,
        borderRadius: 10000,
        marginBottom: 12,
      }}
    ></View>
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

const calculateHeights: (
  calendarDay: CalendarDayType | undefined,
  homeworkBodyHeight: number | undefined,
  heightsToGoToMinimumIndex: {
    [key: string]: boolean;
  },
  minimumHomeworkHeight: number
) => { heights: number[]; totalHeight: number } = (
  calendarDay,
  homeworkBodyHeight,
  heightsToGoToMinimumIndex,
  minimumHomeworkHeight
) => {
  let totalHeight = 0;
  let heightToRemove = 0;
  if (!calendarDay || !homeworkBodyHeight) {
    return { heights: [], totalHeight: 0 };
  }

  if (
    calendarDay.user.homework.length &&
    homeworkBodyHeight / calendarDay?.user.homework.length <
      minimumHomeworkHeight
  ) {
    const newMinHomeworkHeight =
      homeworkBodyHeight / calendarDay?.user.homework.length;
    console.log(
      "CHANGING MINIMUM HOMEWORK HEIGHT TO ",
      newMinHomeworkHeight,
      " FROM ",
      minimumHomeworkHeight
    );
    return calculateHeights(
      calendarDay,
      homeworkBodyHeight,
      {},
      newMinHomeworkHeight
    );
  }

  const heights = [];
  for (let i = 0; i < calendarDay.user.homework.length; i++) {
    const homework = calendarDay.user.homework[i];
    if (heightsToGoToMinimumIndex[i] === true) {
      heights.push(minimumHomeworkHeight);
      totalHeight += minimumHomeworkHeight;
      continue;
    }
    const height =
      (homeworkBodyHeight * homework.plannedDates[0].minutesAssigned) /
      calendarDay.freeMins;
    if (height < minimumHomeworkHeight) {
      heightsToGoToMinimumIndex[i] = true;
      heightToRemove += minimumHomeworkHeight - height;
    } else {
      totalHeight += height;
      heights.push(height);
    }
  }
  if (heightToRemove > 0) {
    return calculateHeights(
      calendarDay,
      homeworkBodyHeight - heightToRemove,
      heightsToGoToMinimumIndex,
      minimumHomeworkHeight
    );
  }
  return { heights, totalHeight };
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
