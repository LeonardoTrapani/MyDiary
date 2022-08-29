import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { AddHomeworkStackScreenProps, FreeDay } from "../../types";
import MinutesToHoursMinutes from "../components/MinutesToHourMinuets";
import { MediumText } from "../components/StyledText";
import { View } from "../components/Themed";
import globalStyles from "../constants/Syles";
import { useFreeDays } from "../util/react-query-hooks";
import Slider from "@react-native-community/slider";
import Icon from "@expo/vector-icons/Ionicons";

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
      <View style={[{ backgroundColor: card }]}>
        <Slider
          minimumValue={0}
          maximumValue={props.freeDay.minutesToAssign}
          onValueChange={(mins) => setAssignedMinutes(+mins.toFixed(0))}
          disabled={isDisabled}
          thumbTintColor={!isDisabled ? primary : "#888"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  freeDayDate: {
    fontSize: 18,
  },
  freeDayContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
  },
  freeMinutes: {
    fontSize: 25,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderContainer: {
    flexDirection: "row",
  },
});

export default PlannedDatesScreen;
