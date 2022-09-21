import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  HomeStackParamList,
  HomeStackScreenProps,
  SingleHomeworkType,
} from "../../types";
import Break from "../components/Break";
import ErrorComponent from "../components/ErrorComponent";
import { ItalicText, MediumText, RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import { useSingleHomework, useValidToken } from "../util/react-query-hooks";
import globalStyles from "../constants/Syles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completePlannedDate } from "../api/homework";
import Colors from "../constants/Colors";
import useColorScheme from "../util/useColorScheme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const SingleHomeworkScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"SingleHomework">) => {
  const { homeworkId } = route.params;

  const {
    data: singleHomework,
    isError: isSingleHomeworkError,
    error: singleHomeworkError,
    isLoading: isSingleHomeworkLoading,
  } = useSingleHomework(homeworkId);

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
        <SingleHomewrk
          singleHomework={singleHomework}
          navigation={navigation}
        />
      )}
    </View>
  );
};

const SingleHomewrk: React.FC<{
  singleHomework: SingleHomeworkType | undefined;
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    "SingleHomework",
    undefined
  >;
}> = (props) => {
  const [descriptionHeight, setDescriptionHeight] = useState<
    undefined | number
  >(undefined);
  const cs = useColorScheme();
  const { errorColor } = Colors[cs];

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
        <RegularText style={styles.rowText}>Delivery Date:</RegularText>
        <RegularText style={styles.rowText}>
          {new Date(props.singleHomework.expirationDate).toLocaleDateString()}
        </RegularText>
      </View>
      <View style={styles.row}>
        <RegularText style={styles.rowText}>Duration:</RegularText>
        <RegularText style={styles.rowText}>
          {minutesToHoursMinutesFun(props.singleHomework.duration)}
        </RegularText>
      </View>
      <View style={styles.row}>
        <RegularText style={styles.rowText}>Time left to complete:</RegularText>
        <RegularText style={styles.rowText}>
          {minutesToHoursMinutesFun(props.singleHomework.timeToComplete)}
        </RegularText>
      </View>
      <View style={[styles.row]}>
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
      <View style={[styles.row, { marginBottom: 0 }]}>
        <RegularText style={styles.rowText}>Completed:</RegularText>
        {props.singleHomework.completed ? (
          <Ionicons name="checkmark" size={22} color="#32a854" />
        ) : (
          <Ionicons name="close-outline" size={22} color={errorColor} />
        )}
      </View>
      <View style={styles.breakContainer}>
        <Break />
      </View>
      <MediumText style={styles.plannedDatesTitle}>Planned Dates</MediumText>
      <FlatList
        data={props.singleHomework.plannedDates}
        renderItem={({ item }) => (
          <PlannedDate plannedDate={item} navigation={props.navigation} />
        )}
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
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    "SingleHomework",
    undefined
  >;
}> = (props) => {
  const { data: validToken } = useValidToken();
  const queryClient = useQueryClient();

  const completePlannedDateMutation = useMutation(
    (pldCompInfo: { plannedDateId: number; completed: boolean }) => {
      return completePlannedDate(
        pldCompInfo.plannedDateId,
        validToken,
        pldCompInfo.completed
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["singleHomework"]);
        queryClient.invalidateQueries(["calendarDay"]);
      },
    }
  );

  const [isCompleted, setIsCompleted] = useState(props.plannedDate.completed);

  useEffect(() => {
    setIsCompleted(props.plannedDate.completed);
  }, [props.plannedDate.completed]);
  const undoCompleteHandler = () => {
    setIsCompleted(false);
    completePlannedDateMutation.mutate({
      plannedDateId: props.plannedDate.id,
      completed: false,
    });
  };

  const completeHandler = () => {
    setIsCompleted(true);
    completePlannedDateMutation.mutate({
      plannedDateId: props.plannedDate.id,
      completed: true,
    });
  };

  const cs = useColorScheme();
  const error = Colors[cs].errorColor;

  const pressHandler = () => {
    props.navigation.navigate("Root", { date: props.plannedDate.date });
  };

  return (
    <CardView style={[styles.planneDateContainer, globalStyles.smallShadow]}>
      {completePlannedDateMutation.isError && (
        <RegularText
          style={[
            styles.plannedDateError,
            { borderColor: error, color: error },
          ]}
        >
          {completePlannedDateMutation.error as string}
        </RegularText>
      )}

      <CardView
        style={[
          styles.row,
          {
            marginBottom: 0,
            marginHorizontal: 0,
          },
        ]}
      >
        <TouchableOpacity onPress={pressHandler} style={{ flex: 1 }}>
          <CardView style={{ flex: 1 }}>
            <MediumText style={styles.plannedDateDate}>
              {new Date(props.plannedDate.date).toDateString()}
            </MediumText>
            <RegularText style={styles.plannedDateMinutesAssigned}>
              {minutesToHoursMinutesFun(props.plannedDate.minutesAssigned)}
            </RegularText>
          </CardView>
        </TouchableOpacity>
        {isCompleted ? (
          <TouchableOpacity onPress={undoCompleteHandler}>
            <CompletedIcon />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={completeHandler}>
            <UncompletedIcon />
          </TouchableOpacity>
        )}
      </CardView>
    </CardView>
  );
};

export const UncompletedIcon: React.FC = () => {
  return <Ionicons color="#aaaaaa" name="checkmark-circle-outline" size={26} />;
};

export const CompletedIcon: React.FC = () => {
  return <Ionicons color="#32a854" name="checkmark-circle" size={26} />;
};

const DESCRIPTION_MAX_HEIGHT = 123;

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
    marginBottom: 12,
    marginHorizontal: 20,
  },
  rowText: {
    fontSize: 16,
  },
  subjectCircle: {
    aspectRatio: 2.5,
    borderRadius: 1000,
    borderWidth: 0.5,
    borderColor: "#888",
    height: 19,
  },
  plannedDatesTitle: {
    fontSize: 21,
    marginHorizontal: 20,
  },
  planneDateContainer: {
    marginVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
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
  plannedDateError: {
    borderWidth: 0.3,
    marginVertical: 5,
    padding: 5,
  },
});

export default SingleHomeworkScreen;
