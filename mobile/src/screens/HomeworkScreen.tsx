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
  HomeworkStackParamList,
  HomeworkStackScreenprops,
  RootStackParamList,
} from "../../types";
import DateTimePicker from "react-native-modal-datetime-picker";
import { RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import globalStyles from "../constants/Syles";
import { useCalendarDay } from "../util/react-query-hooks";
import ErrorComponent from "../components/ErrorComponent";
import moment from "moment";
import { MINIMUM_HOMEWORK_HEIGHT } from "../constants/constants";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "../components/TextButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const HomeworkScreen = ({ navigation }: HomeworkStackScreenprops<"Root">) => {
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);
  const [homeworkBodyHeight, setHomeworkBodyHeight] = useState<
    number | undefined
  >(undefined);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(
    moment().startOf("day").toISOString()
  );

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

  const { heights, totalHeight: totalHeight } = useMemo(() => {
    if (!calendarDay || !homeworkBodyHeight) {
      return { heights: [], totalHeight: 0 };
    }
    const overflows =
      calendarDay?.user.homework.length * MINIMUM_HOMEWORK_HEIGHT >
      homeworkBodyHeight / 1.5;

    if (overflows) {
      return calculateHeightsWithoutAdapting(
        calendarDay,
        homeworkBodyHeight,
        calendarDay.freeMins
      );
    }
    return calculateHeights(
      calendarDay,
      homeworkBodyHeight,
      {},
      [],
      calendarDay.freeMins
    );
  }, [calendarDay, homeworkBodyHeight]);

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
          setCurrentCalendarDate(moment().startOf("day").toISOString());
        }}
        currentCalendarDate={currentCalendarDate}
      />
      {isCalendarDayLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ErrorComponent text={calendarDayError.message} />
      ) : (
        calendarDay && (
          <>
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
                scrollEnabled={
                  totalHeight > (homeworkBodyHeight || 0) ? true : false
                }
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
    </View>
  );
};

const MyHomeworkHeader: React.FC<{
  onToday: () => void;
  currentCalendarDate: string;
  onShowCalendar: () => void;
  onPageForward: () => void;
  onPageBackward: () => void;
  navigation: NativeStackNavigationProp<
    HomeworkStackParamList,
    "Root",
    undefined
  >;
}> = (props) => {
  return (
    <View style={styles.headerContainer}>
      <TextButton
        title="today"
        onPress={props.onToday}
        style={[styles.headerText, styles.headerleft]}
      />
      <DateChangeButton
        date={moment(props.currentCalendarDate).toDate()}
        onShowCalendar={props.onShowCalendar}
        onPageForward={props.onPageForward}
        onPageBackward={props.onPageBackward}
        //setCurrentCalendarDate((prev) => {
        //return moment(prev).startOf("day").subtract(1, "day").toISOString();
        //});
      />
      <TextButton
        title="edit"
        textStyle={{ textAlign: "right" }}
        onPress={() => {
          props.navigation.navigate("Edit");
        }}
        style={[styles.headerText, styles.subheaderRight]}
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
  scrollEnabled: boolean;
}> = (props) => {
  if (!props.calendarDay || !props.heights) {
    return <></>;
  }
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ height: props.scrollEnabled ? undefined : props.totalHeight }}
      >
        <FlatList
          data={props.calendarDay.user.homework}
          scrollEnabled={props.scrollEnabled}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <CalendarDayHomework
              homework={item}
              freeTime={props.freeTime}
              i={index}
              height={props.heights[index]}
              showAtRight={index % 2 === 0}
            />
          )}
        />
      </View>
      {(props.minutesToAssign > 0 ||
        (props.calendarDay.user.homework.length === 0 &&
          props.minutesToAssign === 0)) && (
        <FreeTimeComponent timeToAssign={props.minutesToAssign} />
      )}
    </View>
  );
};

const FreeTimeComponent: React.FC<{ timeToAssign: number }> = (props) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        },
        styles.calendarDayHomework,
      ]}
    >
      <HomeworkBar color="#aaa" />
      <RegularText style={[styles.homeworkText, styles.homeworkNotCenterText]}>
        Free Time
      </RegularText>
      <TimeBar i={-1} time={props.timeToAssign} />
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
  showAtRight: boolean;
  i: number;
}> = (props) => {
  if (props.homework.plannedDates.length > 1) {
    console.warn(
      "planned dates length is more than 1? ",
      props.homework.plannedDates
    );
  }
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          height: props.height,
        },
        styles.calendarDayHomework,
      ]}
    >
      <HomeworkBar color={props.homework.subject.color} />
      <RegularText
        style={[
          styles.homeworkText,
          props.height === MINIMUM_HOMEWORK_HEIGHT
            ? styles.homeworkCenterText
            : styles.homeworkNotCenterText,
        ]}
      >
        {props.homework.name}
      </RegularText>
      <TouchableOpacity
        style={[
          styles.checkIconContainer,
          props.height === MINIMUM_HOMEWORK_HEIGHT
            ? styles.homeworkCenterText
            : styles.homeworkNotCenterText,
        ]}
      ></TouchableOpacity>
      <TimeBar
        time={props.homework.plannedDates[0].minutesAssigned}
        i={props.i}
      />
    </TouchableOpacity>
  );
};

const HomeworkBar: React.FC<{ color: string }> = (props) => {
  return (
    <View style={[styles.homeworkBar, { backgroundColor: props.color }]}></View>
  );
};

const TimeBar: React.FC<{
  time: number;
  i: number;
}> = (props) => {
  return (
    <View style={styles.timeBarContainer}>
      {props.i === 0 && (
        <RegularText style={styles.timeBarText}>
          {minutesToHoursMinutesFun(0, 1)}
        </RegularText>
      )}
      <View style={[styles.timeBar]}></View>
      <RegularText style={[styles.timeBarText]}>
        {minutesToHoursMinutesFun(props.time, 1)}
      </RegularText>
    </View>
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
  maxHeight: number | undefined,
  alreadyModifiedHeightsIndexes: {
    [key: string]: boolean;
  },
  heights: number[],
  freeMins: number | undefined
) => {
  totalHeight: number;
  heights: number[];
} = (
  calendarDay,
  maxHeight,
  alreadyModifiedHeightsIndexes,
  heights,
  freeMins
) => {
  if (!calendarDay || !maxHeight || !freeMins) {
    return { totalHeight: 0, heights: [] };
  }

  let totalHeight = 0;
  let minutesToRemove = 0;
  let heightToRemove = 0;

  let needToRerun = false;

  for (let i = 0; i < calendarDay.user.homework.length; i++) {
    const currentHomework = calendarDay.user.homework[i];

    if (alreadyModifiedHeightsIndexes[i] === true) {
      totalHeight += MINIMUM_HOMEWORK_HEIGHT;
      continue;
    }

    const currentHomeworkHeight =
      (maxHeight * currentHomework.plannedDates[0].minutesAssigned) / freeMins;

    if (currentHomeworkHeight < MINIMUM_HOMEWORK_HEIGHT) {
      if (heights[i]) {
        heights[i] = MINIMUM_HOMEWORK_HEIGHT;
      } else {
        heights.push(MINIMUM_HOMEWORK_HEIGHT);
      }
      minutesToRemove += currentHomework.plannedDates[0].minutesAssigned;
      heightToRemove += MINIMUM_HOMEWORK_HEIGHT;
      alreadyModifiedHeightsIndexes[i] = true;
      needToRerun = true;
    } else {
      totalHeight += currentHomeworkHeight;
      if (heights[i]) {
        heights[i] = currentHomeworkHeight;
      } else {
        heights.push(currentHomeworkHeight);
      }
    }
  }

  if (needToRerun) {
    return calculateHeights(
      calendarDay,
      maxHeight - heightToRemove,
      alreadyModifiedHeightsIndexes,
      heights,
      freeMins - minutesToRemove
    );
  }
  return { totalHeight, heights };
};

const calculateHeightsWithoutAdapting: (
  calendarDay: CalendarDayType | undefined,
  maxHeight: number | undefined,
  freeMins: number | undefined
) => {
  totalHeight: number;
  heights: number[];
} = (calendarDay, maxHeight, freeMins) => {
  if (!calendarDay || !maxHeight || !freeMins) {
    return { totalHeight: 0, heights: [] };
  }
  const heights: number[] = [];

  let totalHeight = 0;

  for (let i = 0; i < calendarDay.user.homework.length; i++) {
    const currentHomework = calendarDay.user.homework[i];

    const currentHomeworkHeight =
      (maxHeight * currentHomework.plannedDates[0].minutesAssigned) / freeMins;

    if (currentHomeworkHeight < MINIMUM_HOMEWORK_HEIGHT) {
      if (heights[i]) {
        heights[i] = MINIMUM_HOMEWORK_HEIGHT;
      } else {
        heights.push(MINIMUM_HOMEWORK_HEIGHT);
      }
      totalHeight += MINIMUM_HOMEWORK_HEIGHT;
    } else {
      if (heights[i]) {
        heights[i] = currentHomeworkHeight;
      } else {
        heights.push(currentHomeworkHeight);
      }
      totalHeight += currentHomeworkHeight;
    }
  }

  return { totalHeight, heights };
};

export const EditDayIcon: React.FC = () => {
  const { primary } = useTheme().colors;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      style={{ marginLeft: 14 }}
      onPress={() => {
        navigation.navigate("AddHomework");
      }}
    >
      <Ionicons name="ios-pencil" size={20} color={primary} />
    </TouchableOpacity>
  );
};

//export const AddHomeworkIcon: React.FC = () => {
//const { primary } = useTheme().colors;

//const navigation = useNavigation<NavigationProp<RootTabParamList>>();
//return (
//<TouchableOpacity
//onPress={() => {
//navigation.getParent()?.navigate("AddHomework");
//}}
//>
//<Ionicons name="md-add" size={32} color={primary} />
//</TouchableOpacity>
//);
//};

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
    //borderRadius: 10000,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});

export default HomeworkScreen;
