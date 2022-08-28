import { useTheme } from "@react-navigation/native";
import { AxiosError } from "axios";
import React from "react";
import { ActivityIndicator, FlatList, VirtualizedList } from "react-native";
import { AddHomeworkStackScreenProps, FreeDay } from "../../types";
import { RegularText } from "../components/StyledText";
import { View } from "../components/Themed";
import { useGetDataFromAxiosError } from "../util/axiosUtils";
import { useFreeDays } from "../util/react-query-hooks";

const PlannedDatesScreen = ({
  route,
  navigation,
}: AddHomeworkStackScreenProps<"PlannedDates">) => {
  const {
    data: freeDays,
    isFetched: freeDaysIsFetched,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading: isFreeDaysLoading,
    isError: isFreeDaysError,
    error: freeDaysError,
  } = useFreeDays(route.params);

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const getDataFromAxiosError = useGetDataFromAxiosError(
    freeDaysError as AxiosError
  );
  const { text } = useTheme().colors;

  return (
    <View>
      {isFetchingNextPage ? (
        <ActivityIndicator color={text} />
      ) : (
        <FlatList
          data={freeDays?.pages}
          renderItem={({ item }) => {
            console.log(item.days);
            return (
              <FreeDayComponent
                freeDay={{
                  date: new Date(),
                  minutesToAssign: 1,
                  freeMins: 2,
                }}
              />
            );
          }}
          onEndReached={loadMore}
        />
      )}
    </View>
  );
};

const freeDayExtractorKey = (freeDay: FreeDay) => {
  return freeDay.date.toString();
};

const FreeDayComponent: React.FC<{ freeDay: FreeDay }> = (props) => {
  return <RegularText>{props.freeDay.date.toString()}</RegularText>;
};

export default PlannedDatesScreen;
