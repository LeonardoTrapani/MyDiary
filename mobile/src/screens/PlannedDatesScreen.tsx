import { useTheme } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, FlatList } from "react-native";
import {
  AddHomeworkStackScreenProps,
  FreeDay,
  FreeDaysResponse,
} from "../../types";
import { fetchFreeDays } from "../api/homework";
import { RegularText } from "../components/StyledText";
import { View } from "../components/Themed";
import { useValidToken } from "../util/react-query-hooks";

const PlannedDatesScreen = ({
  route,
}: AddHomeworkStackScreenProps<"PlannedDates">) => {
  //const { isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, data } =
  //useFreeDays(route.params);
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  const {
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    data,
    isError,
    error,
  } = useInfiniteQuery<FreeDaysResponse>(
    ["freeDays"],
    ({ pageParam = 1 }) => fetchFreeDays(pageParam, route.params, validToken),
    {
      enabled: isValidTokenFetched,
      getNextPageParam: (lastPage) => {
        console.log(lastPage);
        return lastPage.nextCursor;
      },
    }
  );
  console.log({ isError, error });

  const loadMore = () => {
    console.log({ hasNextPage });
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
function useCalculateFreeDays(
  params: Readonly<import("../../types").HomeworkInfoType>
): {
  isLoading: any;
  hasNextPage: any;
  data: any;
  fetchNextPage: any;
  isFetchingNextPage: any;
} {
  throw new Error("Function not implemented.");
}
