import { useTheme } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { HomeStackScreenProps, SingleHomeworkType } from "../../types";
import Break from "../components/Break";
import ErrorComponent from "../components/ErrorComponent";
import { MediumText, RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
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
    <View style={styles.container}>
      <View style={styles.row}>
        <RegularText style={styles.rowText}>Duration:</RegularText>
        <RegularText style={styles.rowText}>
          {minutesToHoursMinutesFun(props.singleHomework.duration)}
        </RegularText>
      </View>
      <View style={styles.row}>
        <RegularText style={styles.rowText}>Delivery Date: </RegularText>
        <RegularText style={styles.rowText}>
          {new Date(props.singleHomework.expirationDate).toLocaleDateString()}
        </RegularText>
      </View>
      <View style={styles.row}>
        <RegularText style={styles.rowText}>
          {props.singleHomework.subject.name}
        </RegularText>
        <View
          style={[
            styles.subjectCircle,
            { backgroundColor: props.singleHomework.subject.color },
          ]}
        />
      </View>
      <View style={styles.breakContainer}>
        <Break />
      </View>
      <MediumText style={styles.plannedDatesTitle}>Planned Dates</MediumText>
      <FlatList
        data={props.singleHomework.plannedDates}
        renderItem={({ item }) => <PlannedDate plannedDate={item} />}
      ></FlatList>
    </View>
  );
};

export const PlannedDate: React.FC<{
  plannedDate: {
    date: string;
    minutesAssigned: number;
    id: number;
    completed: boolean;
  };
}> = (props) => {
  const { card } = useTheme().colors;
  return (
    <View style={[styles.planneDateContainer, { backgroundColor: card }]}>
      <CardView style={[styles.row, { marginBottom: 0 }]}>
        <CardView>
          <MediumText style={styles.plannedDateDate}>
            {new Date(props.plannedDate.date).toDateString()}
          </MediumText>
          <RegularText style={styles.plannedDateMinutesAssigned}>
            {minutesToHoursMinutesFun(props.plannedDate.minutesAssigned)}
          </RegularText>
        </CardView>
        <RegularText>
          Completed: {props.plannedDate.completed ? "true" : "false"}
        </RegularText>
      </CardView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  rowText: {
    fontSize: 17,
  },
  subjectCircle: {
    aspectRatio: 3,
    borderRadius: 1000,
    borderWidth: 0.5,
    borderColor: "#888",
    height: 22,
    backgroundColor: "red",
  },
  breakContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  plannedDatesTitle: {
    fontSize: 21,
  },
  planneDateContainer: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 12,
  },
  plannedDateDate: {
    fontSize: 16,
  },
  plannedDateMinutesAssigned: {
    marginTop: 2,
    fontSize: 17,
  },
});

export default SingleHomeworkScreen;
