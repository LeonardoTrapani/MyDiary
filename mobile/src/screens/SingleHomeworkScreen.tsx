import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { HomeStackScreenProps, SingleHomeworkType } from "../../types";
import Break from "../components/Break";
import ErrorComponent from "../components/ErrorComponent";
import { ItalicText, MediumText, RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import { useSingleHomework } from "../util/react-query-hooks";
import globalStyles from "../constants/Syles";

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
    <View style={{ flex: 1 }}>
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
  const [descriptionHeight, setDescriptionHeight] = useState<
    undefined | number
  >(undefined);

  if (!props.singleHomework) {
    return <ErrorComponent text="there is not homework" />;
  }

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={styles.scrolViewContainer}>
        <ScrollView
          scrollEnabled={(descriptionHeight || 0) > DESCRIPTION_MAX_HEIGHT}
        >
          <ItalicText
            style={styles.description}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setDescriptionHeight(height);
            }}
          >
            {props.singleHomework.description}
          </ItalicText>
        </ScrollView>
      </View>
      <View style={styles.breakContainer}>
        <Break />
      </View>
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
      <View style={[styles.row, { marginBottom: 0 }]}>
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
      />
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
  return (
    <CardView style={[styles.planneDateContainer, globalStyles.smallShadow]}>
      <CardView style={[styles.row, { marginBottom: 0, marginHorizontal: 0 }]}>
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
    </CardView>
  );
};

const DESCRIPTION_MAX_HEIGHT = 150;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
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
    marginHorizontal: 20,
  },
  rowText: {
    fontSize: 16,
  },
  subjectCircle: {
    aspectRatio: 3,
    borderRadius: 1000,
    borderWidth: 0.5,
    borderColor: "#888",
    height: 22,
  },
  plannedDatesTitle: {
    fontSize: 21,
    marginHorizontal: 20,
  },
  planneDateContainer: {
    marginVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  plannedDateDate: {
    fontSize: 16,
  },
  plannedDateMinutesAssigned: {
    marginTop: 2,
    fontSize: 17,
  },
  description: {
    fontSize: 16,
  },
  breakContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
    height: 0.4,
  },
  scrolViewContainer: {
    paddingHorizontal: 20,
    maxHeight: DESCRIPTION_MAX_HEIGHT,
  },
});

export default SingleHomeworkScreen;
