import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  AddHomeworkStackScreenProps,
  PlannedHomeworkScreenProps,
  PlannedHomeworkStackParamList,
} from "../../types";
import { editDay } from "../api/day";
import CalendarHomeworkComponent from "../components/CalendarHomeworkComponent";
import ErrorComponent from "../components/ErrorComponent";
import MyDurationPicker from "../components/MyDurationPicker";
import { BoldText, MediumText, RegularText } from "../components/StyledText";
import { activeInfoDayAtom } from "../util/atoms";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import {
  usePlannedCalendarDay,
  useValidToken,
} from "../util/react-query-hooks";

const HomeScreen = ({
  navigation,
  route,
}: PlannedHomeworkScreenProps<"Root">) => {
  const initialDate = moment().startOf("day").toISOString();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(initialDate);
  const querPlannedCalendarDayResult = usePlannedCalendarDay(
    moment(currentCalendarDate)
  );

  return (
    <CalendarHomeworkComponent
      navigation={navigation}
      date={route.params?.date}
      planned={false}
      queryPlannedCalendarDayResult={querPlannedCalendarDayResult}
      currentCalendarDate={currentCalendarDate}
      setCurrentCalendarDate={setCurrentCalendarDate}
    />
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

export default HomeScreen;
