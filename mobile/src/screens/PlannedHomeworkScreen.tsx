import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AddHomeworkStackScreenProps,
  PlannedCalendarDayType,
  PlannedHomeworkScreenProps,
  PlannedHomeworkStackParamList,
  RootStackParamList,
} from "../../types";
import { editDay } from "../api/day";
import { completePlannedDate } from "../api/homework";
import { MyHomeworkHeader } from "../components/CalendarHomeworkComponent";
import ErrorComponent from "../components/ErrorComponent";
import MyDurationPicker from "../components/MyDurationPicker";
import { BoldText, MediumText, RegularText } from "../components/StyledText";
import { activeInfoDayAtom } from "../util/atoms";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import { useValidToken } from "../util/react-query-hooks";
import useCalendarDay from "../util/useCurrentCalendarDay";

const PlannedHomeworkScreen = ({
  route,
}: PlannedHomeworkScreenProps<"Root">) => {
  const {
    isLoadingShown,
    parsedError,
    plannedQueryResponse,
    onToday,
    onPageForward,
    onPageBackward,
    onSetCalendarDate,
    currentCalendarDate,
  } = useCalendarDay(200, true, route.params?.date);

  return (
    <View style={{ flex: 1 }}>
      <MyHomeworkHeader
        onToday={onToday}
        onPageForward={onPageForward}
        onPageBackward={onPageBackward}
        onSetCalendarDate={onSetCalendarDate}
        currentCalendarDate={currentCalendarDate}
      />
      <PlannedHomeworkBody
        currentDate={currentCalendarDate}
        data={plannedQueryResponse.data}
        isError={plannedQueryResponse.isError}
        isLoading={isLoadingShown ? true : plannedQueryResponse.isFetching}
        errorMessage={parsedError?.message}
      />
    </View>
  );
};

export const PlannedHomeworkBody: React.FC<{
  currentDate: string;
  isLoading: boolean;
  data: PlannedCalendarDayType | undefined;
  errorMessage?: string;
  isError: boolean;
}> = (props) => {
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
    const completedHomework = props.data?.user.homework.filter(
      (hmk) => hmk.plannedDates[0].completed === true
    );
    const notCompletedHomework = props.data?.user.homework.filter((hmk) => {
      return hmk.plannedDates[0].completed === false;
    });
    return [...(notCompletedHomework || []), ...(completedHomework || [])];
  }, [props.data?.user.homework]);

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
          <UncompleteCircle
            isLoading={isLoading}
            onUncomplete={uncompleteHandler}
          />
        ) : (
          <CompleteCircle onComplete={completeHandler} isLoading={isLoading} />
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

export const UncompleteCircle: React.FC<{
  onUncomplete: () => void;
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

export const CompleteCircle: React.FC<{
  onComplete: () => void;
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
}:
  | AddHomeworkStackScreenProps<"info">
  | PlannedHomeworkScreenProps<"Info">) => {
  const { data: validToken } = useValidToken();

  const queryClient = useQueryClient();
  const editDayMutation = useMutation(
    (dayInfo: { date: string; freeMinutes: number }) => {
      return editDay(dayInfo.date, dayInfo.freeMinutes, validToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["plannedCalendarDay"]);
        queryClient.invalidateQueries(["dueCalendarDay"]);
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
      {editDayMutation.isLoading ? <ActivityIndicator /> : <></>}

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

export const CalendarDayInfoIcon: React.FC = () => {
  const { primary } = useTheme().colors;

  const navigation =
    useNavigation<NavigationProp<PlannedHomeworkStackParamList>>();

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

export default PlannedHomeworkScreen;

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
