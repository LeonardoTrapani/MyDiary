import { useTheme } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { AddHomeworkStackScreenProps, FreeDay } from "../../types";
import MinutesToHoursMinutes from "../components/MinutesToHourMinuets";
import { BoldText, MediumText, RegularText } from "../components/StyledText";
import { useThemeColor, View } from "../components/Themed";
import globalStyles from "../constants/Syles";
import { useFreeDays } from "../util/react-query-hooks";

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
  const { card } = useTheme().colors;
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
          minutes={props.freeDay.freeMins}
          style={styles.freeMinutes}
        />
      </View>
      <RegularText>MINS TO ASSIGN: {props.freeDay.minutesToAssign}</RegularText>
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
});

export default PlannedDatesScreen;
