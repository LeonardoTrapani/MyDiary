import React, { useEffect, useLayoutEffect } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { HomeStackScreenProps, SingleHomeworkType } from "../../types";
import ErrorComponent from "../components/ErrorComponent";
import MinutesToHoursMinutes from "../components/MinutesToHourMinuets";
import { RegularText } from "../components/StyledText";
import { View } from "../components/Themed";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import { useSingleHomework } from "../util/react-query-hooks";

const SingleHomeworkScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"SingleHomework">) => {
  const { title, homeworkId } = route.params;

  const {
    data: singleHomework,
    isError: isSingleHomeworkError,
    error: singleHomeworkError,
    isLoading: isSingleHomeworkLoading,
  } = useSingleHomework(homeworkId);

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  useEffect(() => {
    if (singleHomework) {
      navigation.setOptions({ title: singleHomework.name });
    }
  }, [navigation, singleHomework]);

  return (
    <View>
      {isSingleHomeworkLoading ? (
        <ActivityIndicator />
      ) : isSingleHomeworkError ? (
        <ErrorComponent text={singleHomeworkError as string} />
      ) : (
        <SingleHomewrk singleHomework={singleHomework} />
      )}
    </View>
  );
};

const SingleHomewrk: React.FC<{
  singleHomework: SingleHomeworkType | undefined;
}> = (props) => {
  if (!props.singleHomework) {
    return <ErrorComponent text="there is not homework" />;
  }

  return (
    <View>
      <View
        style={{
          backgroundColor: props.singleHomework.subject.color,
          height: 50,
          width: 50,
        }}
      ></View>
      <RegularText>
        Duration: {minutesToHoursMinutesFun(props.singleHomework.duration)}
      </RegularText>
      <RegularText>Completed: {props.singleHomework.completed}</RegularText>
      <RegularText>
        Expiration Date:{" "}
        {new Date(props.singleHomework.expirationDate).toLocaleDateString()}
      </RegularText>
      <RegularText>
        Completed: {props.singleHomework.completed ? "true" : "false"}
      </RegularText>
      <FlatList
        data={props.singleHomework.plannedDates}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 40 }}>
            <RegularText>
              Date: {new Date(item.date).toLocaleDateString()}
            </RegularText>
            <RegularText>Minutes Assigned: {item.minutesAssigned}</RegularText>
          </View>
        )}
      ></FlatList>
    </View>
  );
};

export default SingleHomeworkScreen;
