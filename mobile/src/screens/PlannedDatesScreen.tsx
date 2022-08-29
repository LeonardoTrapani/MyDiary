import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { AddHomeworkStackScreenProps, FreeDay } from "../../types";
import MinutesToHoursMinutes from "../components/MinutesToHourMinuets";
import { MediumText } from "../components/StyledText";
import { View } from "../components/Themed";
import globalStyles from "../constants/Syles";
import { useFreeDays } from "../util/react-query-hooks";
import { Slider } from "@miblanchard/react-native-slider";

const PlannedDatesScreen = ({
  route,
}: AddHomeworkStackScreenProps<"PlannedDates">) => {
  const { isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, data } =
    useFreeDays(route.params);

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const { text } = useTheme().colors;

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator color={text} />
      ) : (
        <>
          <FlatList
            data={data?.pages.map((page) => page.page.freeDays).flat()}
            renderItem={({ item }) => {
              return <FreeDayComponent freeDay={item} />;
            }}
            onEndReached={loadMore}
          />
          {isFetchingNextPage && <ActivityIndicator color={text} />}
        </>
      )}
    </View>
  );
};

const FreeDayComponent: React.FC<{ freeDay: FreeDay }> = (props) => {
  const formattedDate = new Date(props.freeDay.date).toDateString();
  const [assignedMinutes, setAssignedMinutes] = useState(
    props.freeDay.freeMins - props.freeDay.minutesToAssign
  );
  const [isDisabled, setIsDisabled] = useState(
    props.freeDay.minutesToAssign === 0
  );
  const { card, primary } = useTheme().colors;
  return (
    <View
      style={[
        styles.freeDayContainer,
        globalStyles.smallShadow,
        { backgroundColor: card },
      ]}
    >
      <View style={[styles.titleContainer, { backgroundColor: card }]}>
        <MediumText style={styles.freeDayDate}>{formattedDate}</MediumText>
        <MinutesToHoursMinutes
          minutes={assignedMinutes}
          style={styles.freeMinutes}
        />
      </View>
      <Slider
        minimumValue={0}
        maximumValue={props.freeDay.minutesToAssign}
        onValueChange={(mins) => {
          if (typeof mins === "number") {
            return setAssignedMinutes(+mins.toFixed());
          }
          return setAssignedMinutes(+mins[mins.length - 1].toFixed());
        }}
        value={assignedMinutes}
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
    marginVertical: 10,
    marginHorizontal: 20,
    justifyContent: "space-between",
    height: 200,
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
  sliderContainer: {
    flexDirection: "row",
  },
});

export default PlannedDatesScreen;
