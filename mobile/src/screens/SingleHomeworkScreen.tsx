/* eslint-disable react/no-unescaped-entities */
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  PlannedHomeworkStackParamList,
  PlannedHomeworkScreenProps,
  SingleHomeworkType,
  HomeScreenProps,
} from "../../types";
import Break from "../components/Break";
import ErrorComponent from "../components/ErrorComponent";
import {
  BoldText,
  ItalicText,
  MediumText,
  RegularText,
} from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import { useSingleHomework, useValidToken } from "../util/react-query-hooks";
import globalStyles from "../constants/Syles";
import { Ionicons } from "@expo/vector-icons";
import { completePlannedDate } from "../api/homework";
import Colors from "../constants/Colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useColorScheme from "../util/useColorScheme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import moment from "moment";
import SolidButton from "../components/SolidButton";
import NonModalDurationPicker from "../components/NonModalDurationPicker";

const SingleHomeworkScreen = ({
  navigation,
  route,
}: PlannedHomeworkScreenProps<"SingleHomework">) => {
  const { homeworkId } = route.params;

  const {
    data: singleHomework,
    isError: isSingleHomeworkError,
    error: singleHomeworkError,
    isLoading: isSingleHomeworkLoading,
  } = useSingleHomework(homeworkId);

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
    PlannedHomeworkStackParamList,
    "SingleHomework",
    undefined
  >;
}> = (props) => {
  const [descriptionHeight, setDescriptionHeight] = useState<
    undefined | number
  >(undefined);
  const cs = useColorScheme();
  const { errorColor } = Colors[cs];
  const { primary } = useTheme().colors;

  if (!props.singleHomework) {
    return <ErrorComponent text="there is not homework" />;
  }
  const onRedoPlannedDates = () => {
    if (!props.singleHomework) return;

    const {
      duration,
      description,
      name: title,
      subject,
      //completed,
      plannedDates,
      expirationDate,
    } = props.singleHomework;

    if (moment(expirationDate).isBefore(moment())) {
      Alert.alert(
        "Oops!",
        "You can only replan homework that are due after today",
        [{ text: "Ok", style: "default" }]
      );
      return;
    }

    if (!duration) {
      props.navigation.navigate("Duration", {
        homeworkPlanInfo: {
          duration: 0,
          expirationDate,
          description,
          subjectId: subject.id,
          title,
        },
        homeworkId: props.singleHomework.id,
        previousPlannedDates: plannedDates,
      });
      return;
    }

    props.navigation.navigate("PlannedDates", {
      homeworkPlanInfo: {
        duration,
        expirationDate,
        description,
        subjectId: subject.id,
        title,
      },
      homeworkId: props.singleHomework.id,
      previousPlannedDates: plannedDates,
    });
  };

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
      <View style={[styles.row]}>
        <MediumText style={styles.rowText}>
          {props.singleHomework.subject.name}
        </MediumText>
        <View
          style={[
            styles.subjectCircle,
            { backgroundColor: props.singleHomework.subject.color },
          ]}
        />
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
          {minutesToHoursMinutesFun(props.singleHomework.duration) || "N/A"}
        </RegularText>
      </View>
      <View style={styles.row}>
        <RegularText style={styles.rowText}>Time left to complete:</RegularText>
        <RegularText style={styles.rowText}>
          {minutesToHoursMinutesFun(props.singleHomework.timeToComplete) ||
            "N/A"}
        </RegularText>
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MediumText style={styles.plannedDatesTitle}>Planned Dates</MediumText>
        <TouchableOpacity onPress={onRedoPlannedDates}>
          <Ionicons
            style={{
              marginHorizontal: 20,
            }}
            name="refresh-circle"
            size={32}
            color={primary}
          />
        </TouchableOpacity>
      </View>
      {!props.singleHomework.plannedDates.length ? (
        <View
          style={{
            padding: 20,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <SolidButton
            title="plan dates"
            onPress={onRedoPlannedDates}
            style={{ marginTop: 20, marginHorizontal: "10%", width: "80%" }}
          />
        </View>
      ) : (
        <FlatList
          data={props.singleHomework.plannedDates}
          renderItem={({ item }) => (
            <PlannedDate plannedDate={item} navigation={props.navigation} />
          )}
        />
      )}
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
    PlannedHomeworkStackParamList,
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
        queryClient.invalidateQueries(["plannedCalendarDay"]);
        queryClient.invalidateQueries(["dueCalendarDay"]);
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

export const DurationScreen = ({
  route,
  navigation,
}: HomeScreenProps<"Duration">) => {
  const [durationDate, setDurationDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );

  const duration = useMemo(() => {
    const dur = durationDate.getMinutes() + durationDate.getHours() * 60;
    return dur;
  }, [durationDate]);

  const onPlanDatesWithDuration = () => {
    if (!route.params.homeworkPlanInfo) return;

    const { description, title, subjectId, expirationDate } =
      route.params.homeworkPlanInfo;

    if (duration === 0) {
      return;
    }

    navigation.navigate("PlannedDates", {
      homeworkPlanInfo: {
        duration,
        expirationDate,
        description,
        subjectId,
        title,
      },
      homeworkId: route.params.homeworkId,
      previousPlannedDates: route.params.previousPlannedDates,
    });
  };

  const onChangeDuration = (date: Date) => {
    setDurationDate(date);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <BoldText style={{ fontSize: 30, marginRight: "30%" }}>
        How much time are you going to need?
      </BoldText>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <CardView
          style={[
            {
              paddingHorizontal: 20,
              marginVertical: 20,
              borderRadius: 20,
            },
            globalStyles.smallShadow,
          ]}
        >
          <NonModalDurationPicker
            value={durationDate}
            onChangeDuration={onChangeDuration}
          />
        </CardView>
      </View>
      <View>
        <SolidButton title="CONTINUE" onPress={onPlanDatesWithDuration} />
      </View>
    </View>
  );
};

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
