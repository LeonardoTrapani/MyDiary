import { useTheme } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import {
  AddHomeworkStackScreenProps,
  FreeDay,
  FreeDays,
  SelectedDay,
} from "../../types";
import { BoldText, MediumText, RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import globalStyles from "../constants/Syles";
import { useFreeDays } from "../util/react-query-hooks";
import { Slider } from "@miblanchard/react-native-slider";
import { minutesToHoursMinutesFun } from "../util/generalUtils";

const PlannedDatesScreen = ({
  route,
}: AddHomeworkStackScreenProps<"PlannedDates">) => {
  const { isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, data } =
    useFreeDays(route.params);

  const freeDays = useMemo(() => {
    return data?.pages.map((page) => page.page.freeDays).flat();
  }, [data?.pages]);

  const [selectedDays, setSelectedDays] = useState<SelectedDay[]>([]);

  const totalAssignedMinutes = useMemo(() => {
    return selectedDays.reduce((prev, curr) => {
      return prev + curr.minutes;
    }, 0);
  }, [selectedDays]);

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const slideCompleteHandler = (minutes: number, i: number) => {
    if (!freeDays) {
      console.warn("There are not free days and you are scrolling a free day?");
      return;
    }
    const currFreeDay = freeDays[i];
    const selectedDaysIndex = selectedDays.findIndex(
      (selDay) => selDay.date === freeDays[i].date
    );

    if (minutes === 0 && selectedDaysIndex !== -1) {
      const newSelectedDays = [...selectedDays];
      newSelectedDays.splice(selectedDaysIndex, 1);
      setSelectedDays(newSelectedDays);
      return;
    }

    if (selectedDaysIndex === -1) {
      setSelectedDays((prev) => [
        ...prev,
        {
          date: currFreeDay.date,
          minutes,
        },
      ]);
      return;
    }
    const newSelectedDays = [...selectedDays];
    newSelectedDays[selectedDaysIndex].minutes = minutes;
    setSelectedDays(newSelectedDays);
  };

  const { text } = useTheme().colors;
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator color={text} />
      ) : (
        <View style={styles.bodyContainer}>
          <BoldText style={styles.titleText}>
            When are you planning to do this homework?
          </BoldText>
          <RegularText style={styles.timeLeftText}>
            Time left to assig:{" "}
            {minutesToHoursMinutesFun(
              route.params.duration - totalAssignedMinutes
            )}
          </RegularText>
          <FreeDayList
            freeDays={freeDays}
            totalTimeToAssign={route.params.duration - totalAssignedMinutes}
            isFetchingNextPage={isFetchingNextPage}
            loadMore={loadMore}
            onChange={slideCompleteHandler}
          />
        </View>
      )}
    </View>
  );
};

const FreeDayList: React.FC<{
  freeDays: FreeDays | undefined;
  onChange: (minutes: number, i: number) => void;
  loadMore: () => void;
  isFetchingNextPage: boolean;
  totalTimeToAssign: number;
}> = ({
  freeDays,
  onChange,
  loadMore,
  isFetchingNextPage,
  totalTimeToAssign,
}) => {
  const { text } = useTheme().colors;
  return (
    <>
      <FlatList
        data={freeDays}
        renderItem={({ item, index }) => {
          return (
            <FreeDayComponent
              freeDay={item}
              onChange={onChange}
              i={index}
              totalTimeToAssign={totalTimeToAssign}
            />
          );
        }}
        onEndReached={loadMore}
      />
      {isFetchingNextPage && <ActivityIndicator color={text} />}
    </>
  );
};

const FreeDayComponent: React.FC<{
  freeDay: FreeDay;
  i: number;
  totalTimeToAssign: number;
  onChange: (minutes: number, i: number) => void;
}> = (props) => {
  const formattedDate = new Date(props.freeDay.date).toDateString();
  const [assignedMinutes, setAssignedMinutes] = useState(
    props.freeDay.freeMins - props.freeDay.minutesToAssign
  );
  const freeMinutes = props.freeDay.freeMins - assignedMinutes;
  const isDisabled =
    props.freeDay.minutesToAssign === 0 ||
    (props.totalTimeToAssign === 0 && assignedMinutes === 0);
  const { card, primary } = useTheme().colors;
  return (
    <View
      style={[
        styles.freeDayContainer,
        globalStyles.smallShadow,
        { backgroundColor: card },
      ]}
    >
      <CardView style={[styles.titleContainer]}>
        <MediumText style={styles.freeDayDate}>{formattedDate}</MediumText>
      </CardView>
      <CardView style={styles.freeDayBodyContainer}>
        <RegularText style={styles.bodyText}>
          Assigned Time: {minutesToHoursMinutesFun(assignedMinutes)}
        </RegularText>
        <RegularText style={styles.bodyText}>
          Free time: {minutesToHoursMinutesFun(freeMinutes)}
        </RegularText>
      </CardView>
      <Slider
        minimumValue={0}
        maximumValue={props.freeDay.minutesToAssign}
        onValueChange={(mins) => {
          let minutes;
          if (typeof mins === "number") {
            minutes = +mins.toFixed();
          } else {
            minutes = +mins[mins.length - 1].toFixed();
          }
          const diff = props.totalTimeToAssign - minutes;
          if (diff < 0) {
            const finalVal = minutes + props.totalTimeToAssign;
            console.log(finalVal);
            //props.onChange(finalVal, props.i);
            //return setAssignedMinutes(finalVal);
            return;
          }
          props.onChange(+minutes.toFixed(), props.i);
          return setAssignedMinutes(minutes);
        }}
        //value={assignedMinutes}
        minimumTrackTintColor={!isDisabled ? primary : "#ddd"}
        disabled={isDisabled}
        maximumTrackTintColor={!isDisabled ? "#888" : "#ddd"}
        thumbTintColor={!isDisabled ? primary : "#ddd"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  freeDayDate: {
    fontSize: 19,
    textAlignVertical: "bottom",
  },
  freeDayContainer: {
    justifyContent: "space-between",
    marginVertical: 10,
    padding: 20,
  },
  freeMinutes: {
    fontSize: 24,
    textAlignVertical: "bottom",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  freeDayBodyContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
  },
  bodyContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  titleText: {
    marginRight: "20%",
    fontSize: 25,
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  timeLeftText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default PlannedDatesScreen;
