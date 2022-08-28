import { useTheme } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { AddHomeworkStackScreenProps, FreeDay } from "../../types";
import { RegularText } from "../components/StyledText";
import { View } from "../components/Themed";
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
  return <RegularText>{props.freeDay.date.toString()}</RegularText>;
};

export default PlannedDatesScreen;
