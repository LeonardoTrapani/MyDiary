import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  AddHomeworkStackScreenProps,
  FreeDaysType,
  FreeDayType,
  HomeworkPlanInfoType,
  SelectedDay as SelectedDayType,
} from "../../types";
import { BoldText, MediumText, RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import globalStyles from "../constants/Syles";
import { useFreeDays, useValidToken } from "../util/react-query-hooks";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import MyDurationPicker from "../components/MyDurationPicker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SolidButton from "../components/SolidButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHomeworkWithPlan, plan } from "../api/homework";
import { useGetDataFromAxiosError } from "../util/axiosUtils";
import { AxiosError } from "axios";
import ErrorComponent from "../components/ErrorComponent";
import { useAtom } from "jotai";
import { activeInfoDayAtom } from "../util/atoms";
import moment from "moment";

const PlannedDatesScreen = ({
  route,
  navigation,
}: AddHomeworkStackScreenProps<"PlannedDates">) => {
  const { isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, data } =
    useFreeDays(route.params.homeworkPlanInfo);
  const { data: validToken } = useValidToken();

  const queryClient = useQueryClient();
  const createHomeworkMutation = useMutation(
    (mutationInfo: {
      homeworkPlanInfo: HomeworkPlanInfoType;
      selectedDays: SelectedDayType[];
    }) => {
      return createHomeworkWithPlan(
        validToken,
        mutationInfo.homeworkPlanInfo,
        mutationInfo.selectedDays
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["plannedCalendarDay"]);
        queryClient.invalidateQueries(["dueCalendarDay"]);
        queryClient.invalidateQueries(["singleHomework"]);
        navigation.getParent()?.goBack();
      },
    }
  );

  const editPlansMutation = useMutation(
    (mutationInfo: {
      homeworkId: number;
      duration: number;
      selectedDays: SelectedDayType[];
    }) => {
      return plan(
        validToken,
        mutationInfo.homeworkId,
        mutationInfo.duration,
        mutationInfo.selectedDays
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["plannedCalendarDay"]);
        queryClient.invalidateQueries(["dueCalendarDay"]);
        queryClient.invalidateQueries(["singleHomework"]);
        navigation.popToTop();
      },
    }
  );
  const freeDays = useMemo(() => {
    return data?.pages.map((page) => page.page.freeDays).flat();
  }, [data?.pages]);

  const [selectedDays, setSelectedDays] = useState<SelectedDayType[]>([]);
  const [hasUpdatedSelectedDays, setHasUpdatedSelectedDays] = useState(false);

  useEffect(() => {
    if (hasUpdatedSelectedDays) {
      return;
    }
    if (route.params.previousPlannedDates) {
      const localArrayToUpdate: SelectedDayType[] = [];

      route.params.previousPlannedDates.forEach((prevPlannedDate) => {
        if (moment(prevPlannedDate.date).isSameOrAfter(moment())) {
          localArrayToUpdate.push({
            date: prevPlannedDate.date,
            minutes: prevPlannedDate.minutesAssigned,
          });
        }
      });
      setSelectedDays((prev) => [...prev, ...localArrayToUpdate]);
      setHasUpdatedSelectedDays(true);
    }
  }, [
    hasUpdatedSelectedDays,
    route.params.previousPlannedDates,
    selectedDays.length,
  ]);

  const totalAssignedMinutes = useMemo(() => {
    return selectedDays.reduce((prev, curr) => {
      return prev + curr.minutes;
    }, 0);
  }, [selectedDays]);

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const createHomeworkHandler = () => {
    if (!route.params.isEditing) {
      if (route.params.homeworkPlanInfo.duration - totalAssignedMinutes !== 0) {
        return Alert.alert(
          "Can't create homework",
          "Assign all the time to create the homework",
          [{ text: "Ok" }]
        );
      }
      createHomeworkMutation.mutate({
        selectedDays,
        homeworkPlanInfo: route.params.homeworkPlanInfo,
      });
    } else {
      if (route.params.homeworkPlanInfo.duration - totalAssignedMinutes !== 0) {
        return Alert.alert(
          "Can't edit plans",
          "Assign all the time to edit the plans",
          [{ text: "Ok" }]
        );
      }
      if (!route.params.homeworkId) {
        console.warn("HOMEWORK ID DOES NOT EXIST");
        return;
      }
      editPlansMutation.mutate({
        homeworkId: route.params.homeworkId,
        duration: route.params.homeworkPlanInfo.duration,
        selectedDays: selectedDays,
      });
    }
  };

  const assignedMinutesChangeHandler = (minutes: number, i: number) => {
    if (!freeDays) {
      console.warn("There are not free days and you are scrolling a free day?");
      return;
    }
    const currFreeDay = freeDays[i];
    const selectedDaysIndex = selectedDays.findIndex(
      (selDay) => selDay.date === freeDays[i].date
    );

    if (minutes === 0 && selectedDaysIndex !== -1) {
      const newSelectedDays = [...selectedDays];
      newSelectedDays.splice(selectedDaysIndex, 1);
      setSelectedDays(newSelectedDays);
      return;
    }

    if (minutes === 0) return;
    if (selectedDaysIndex === -1) {
      setSelectedDays((prev) => [
        ...prev,
        {
          date: currFreeDay.date,
          minutes,
        },
      ]);
      return;
    }

    const newSelectedDays = [...selectedDays];
    newSelectedDays[selectedDaysIndex].minutes = minutes;
    setSelectedDays(newSelectedDays);
  };

  const gax = useGetDataFromAxiosError(
    (createHomeworkMutation.error as AxiosError) ||
      (editPlansMutation.error as AxiosError),
    "an error has occurred creating the homework"
  );

  const { text } = useTheme().colors;

  const [, setActiveInfoDay] = useAtom(activeInfoDayAtom);

  return (
    <>
      <PlannedDatesSecondaryHeader
        timeToAssign={
          route.params.homeworkPlanInfo.duration - totalAssignedMinutes
        }
        isCreateHomeworkLoading={
          createHomeworkMutation.isLoading || editPlansMutation.isError
        }
        onCreate={createHomeworkHandler}
        hasError={createHomeworkMutation.isError || editPlansMutation.isError}
        isEditing={route.params.isEditing}
        error={gax()}
      />
      <View>
        {isLoading ? (
          <ActivityIndicator color={text} />
        ) : (
          <View style={styles.bodyContainer}>
            {!freeDays || freeDays?.length > 0 ? (
              <FreeDayList
                freeDays={freeDays}
                selectedDays={selectedDays}
                totalTimeToAssign={
                  route.params.homeworkPlanInfo.duration - totalAssignedMinutes
                }
                isFetchingNextPage={isFetchingNextPage}
                loadMore={loadMore}
                onChange={assignedMinutesChangeHandler}
                totalDuration={route.params.homeworkPlanInfo.duration}
                onInfo={(i) => {
                  if (!freeDays) return;
                  setActiveInfoDay({
                    date: freeDays[i].date,
                    minutesToAssign: freeDays[i].minutesToAssign,
                    initialFreeTime: freeDays[i].freeMins,
                  });
                  navigation.navigate("info");
                }}
                generalHasUpdated={hasUpdatedSelectedDays}
              />
            ) : (
              <View
                style={{
                  paddingTop: 20,
                }}
              >
                <RegularText style={{ fontSize: 17, textAlign: "center" }}>
                  No free days found
                </RegularText>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
};

const FreeDayList: React.FC<{
  freeDays: FreeDaysType | undefined;
  onChange: (minutes: number, i: number) => void;
  loadMore: () => void;
  isFetchingNextPage: boolean;
  totalTimeToAssign: number;
  totalDuration: number;
  onInfo: (i: number) => void;
  selectedDays: SelectedDayType[];
  generalHasUpdated: boolean;
}> = ({
  freeDays,
  selectedDays,
  onChange,
  loadMore,
  totalDuration,
  generalHasUpdated,
  isFetchingNextPage,
  totalTimeToAssign,
  onInfo,
}) => {
  const { bottom } = useSafeAreaInsets();
  const { text } = useTheme().colors;

  return (
    <>
      <FlatList
        data={freeDays}
        renderItem={({ item, index }) => {
          let showLoading = false;
          if (
            freeDays &&
            index === freeDays?.length - 1 &&
            isFetchingNextPage
          ) {
            showLoading = true;
          }

          return (
            <>
              <FreeDayComponent
                freeDay={item}
                selectedDays={selectedDays}
                onChange={onChange}
                totalDuration={totalDuration}
                i={index}
                totalTimeToAssign={totalTimeToAssign}
                onInfo={(i) => {
                  onInfo(i);
                }}
                generalHasUpdated={generalHasUpdated}
              />
              {showLoading && <ActivityIndicator color={text} />}
              {freeDays && index === freeDays?.length - 1 && (
                <View style={{ height: bottom * 2 }}></View>
              )}
            </>
          );
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={1}
      />
    </>
  );
};

const FreeDayComponent: React.FC<{
  freeDay: FreeDayType;
  i: number;
  totalTimeToAssign: number;
  totalDuration: number;
  onChange: (minutes: number, i: number) => void;
  selectedDays: SelectedDayType[];
  onInfo: (i: number) => void;
  generalHasUpdated: boolean;
}> = (props) => {
  const formattedDate = new Date(props.freeDay.date).toDateString();
  const { primary } = useTheme().colors;

  const [hasUpdatedSelectedDay, setHasUpdatedSelectedDay] = useState(false);

  useEffect(() => {
    if (hasUpdatedSelectedDay || !props.generalHasUpdated) {
      return;
    }
    const currSelectedDay = props.selectedDays.find((selecDay) => {
      return selecDay.date === props.freeDay.date;
    });
    if (currSelectedDay) {
      setAssignedMinutes(currSelectedDay.minutes);
    }
    setHasUpdatedSelectedDay(true);
  }, [
    hasUpdatedSelectedDay,
    props.freeDay.date,
    props.generalHasUpdated,
    props.selectedDays,
  ]);

  const [assignedMinutes, setAssignedMinutes] = useState<number>(0);

  //navigation.setOptions({ title: 'Updated!' })
  return (
    <View style={styles.freeDayContainer}>
      <PercentageAssignedTime
        totalDuration={props.totalDuration}
        assignedTime={assignedMinutes}
      />
      <CardView style={[styles.freeDayInternalContainer]}>
        <CardView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <MediumText style={styles.freeDayDate}>{formattedDate}</MediumText>
          <RegularText style={{ fontSize: 17 }}>
            max: {minutesToHoursMinutesFun(props.freeDay.minutesToAssign)}
          </RegularText>
          <TouchableOpacity
            onPress={() => props.onInfo(props.i)}
            style={{ alignSelf: "flex-start" }}
          >
            <Ionicons name="calendar-sharp" size={18} color={primary} />
          </TouchableOpacity>
        </CardView>
        <SelectFreeMinsComponent
          timeToAssign={props.totalTimeToAssign}
          dayTimeLimit={props.freeDay.minutesToAssign}
          onChangeMintes={(minutes) => {
            setAssignedMinutes(minutes);
            props.onChange(minutes, props.i);
          }}
          assignedMinutes={assignedMinutes}
        />
      </CardView>
    </View>
  );
};

const reachLimitAlert = (message: string) => {
  Alert.alert("Can't change assigned time", message, [
    { text: "Ok", style: "default" },
  ]);
};

const SelectFreeMinsComponent: React.FC<{
  onChangeMintes: (mintes: number) => void;
  assignedMinutes: number;
  timeToAssign: number;
  dayTimeLimit: number;
}> = (props) => {
  const minHandler = () => {
    props.onChangeMintes(0);
  };
  const minusFiveHandler = () => {
    if (props.assignedMinutes < 5) {
      props.onChangeMintes(0);
      return;
    }
    props.onChangeMintes(props.assignedMinutes - 5);
  };
  const plusFiveHandler = () => {
    let timeToAdd = 5;
    if (props.assignedMinutes === props.dayTimeLimit) {
      reachLimitAlert("You have assigned all the time for this day");
      return;
    }
    if (props.assignedMinutes + 5 > props.dayTimeLimit) {
      timeToAdd = props.dayTimeLimit - props.assignedMinutes;
    }
    if (props.timeToAssign === 0) {
      reachLimitAlert("You have assigned all the time");
      return;
    }
    if (props.timeToAssign < timeToAdd) {
      props.onChangeMintes(props.assignedMinutes + props.timeToAssign);
      return;
    }
    props.onChangeMintes(props.assignedMinutes + timeToAdd);
  };
  const maxHandler = () => {
    if (props.timeToAssign === 0) {
      reachLimitAlert("You have assigned all the time");
      return;
    }
    if (props.timeToAssign + props.assignedMinutes < props.dayTimeLimit) {
      props.onChangeMintes(props.timeToAssign + props.assignedMinutes);
      return;
    }
    if (props.assignedMinutes === props.dayTimeLimit) {
      reachLimitAlert("You have assigned all the time for this day");
      return;
    }
    props.onChangeMintes(props.dayTimeLimit);
  };
  const pickerChangeHandler = (minutes: number) => {
    if (props.timeToAssign < minutes - props.assignedMinutes) {
      props.onChangeMintes(props.timeToAssign);
      return;
    }
    props.onChangeMintes(minutes);
  };

  return (
    <CardView style={styles.selectFreeMins}>
      <SelectFreeMinsBtn title="MIN" onPress={minHandler} />
      <SelectFreeMinsBtn title="-5" onPress={minusFiveHandler} />
      <SelectFreeMinsTimePicker
        onChange={pickerChangeHandler}
        timeToAssign={props.timeToAssign}
        assignedMinutes={props.assignedMinutes}
        dayTimeLimit={props.dayTimeLimit}
      />
      <SelectFreeMinsBtn title="+5" onPress={plusFiveHandler} />
      <SelectFreeMinsBtn title="MAX" onPress={maxHandler} />
    </CardView>
  );
};

const SelectFreeMinsBtn: React.FC<{
  title: string;
  onPress: () => void;
}> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <CardView
        style={[
          styles.selectFreeMinsBorder,
          styles.selectFreeMinsBtn,
          globalStyles.smallShadow,
        ]}
      >
        <RegularText style={styles.selectFreeMinsText}>
          {props.title}
        </RegularText>
      </CardView>
    </TouchableOpacity>
  );
};

const SelectFreeMinsTimePicker: React.FC<{
  onChange: (minutes: number) => void;
  dayTimeLimit: number;
  assignedMinutes: number;
  timeToAssign: number;
}> = (props) => {
  const { primary } = useTheme().colors;
  const [isOpened, setIsOpened] = useState(false);
  const maximumTime =
    props.assignedMinutes + props.timeToAssign < props.dayTimeLimit
      ? props.assignedMinutes + props.timeToAssign
      : props.dayTimeLimit;
  return (
    <>
      <MyDurationPicker
        isVisible={isOpened}
        defaultMinutes={props.assignedMinutes % 60}
        deafaultHours={Math.floor(props.assignedMinutes / 60)}
        disabled={props.dayTimeLimit === 0}
        maximumTime={maximumTime}
        onConfirm={(date) => {
          setIsOpened(false);
          const mins = date.getMinutes() + date.getHours() * 60;
          props.onChange(mins);
        }}
        onCancel={() => {
          setIsOpened(false);
        }}
      />
      <TouchableOpacity
        style={[{ flexDirection: "row", flex: 1 }]}
        onPress={() => {
          setIsOpened(true);
        }}
      >
        <CardView
          style={[
            globalStyles.smallShadow,
            styles.selectFreeMinsTimePicker,
            styles.selectFreeMinsBorder,
          ]}
        >
          <BoldText style={[{ color: primary }, styles.selectFreeMinsText]}>
            {minutesToHoursMinutesFun(props.assignedMinutes)}
          </BoldText>
        </CardView>
      </TouchableOpacity>
    </>
  );
};

const PercentageAssignedTime: React.FC<{
  assignedTime: number;
  totalDuration: number;
}> = (props) => {
  const { primary } = useTheme().colors;
  const percentage = (props.assignedTime * 100) / props.totalDuration;
  return (
    <CardView style={[styles.percentagesContainer]}>
      <View
        style={[
          styles.percentage,
          { backgroundColor: primary, width: `${percentage}%` },
        ]}
      ></View>
      <View style={[styles.percentage, { flexGrow: 1 }]}></View>
    </CardView>
  );
};

const PlannedDatesSecondaryHeader: React.FC<{
  onCreate: () => void;
  hasError: boolean;
  error: string | null;
  timeToAssign: number;
  isEditing: boolean;
  isCreateHomeworkLoading: boolean;
}> = (props) => {
  return (
    <CardView style={styles.secondaryHeader}>
      {props.hasError && <ErrorComponent text={props.error} />}
      <CardView style={styles.headerRow}>
        <RegularText style={styles.headerText}>Time to assign:</RegularText>
        <BoldText style={styles.headerText}>
          {minutesToHoursMinutesFun(props.timeToAssign)}
        </BoldText>
      </CardView>
      <SolidButton
        onPress={props.onCreate}
        title={!props.isEditing ? "Create Homework" : "Edit Plans"}
        isLoading={props.isCreateHomeworkLoading}
        style={{
          height: 30,
          borderRadius: 4,
          marginVertical: 8,
        }}
        textStyle={{ fontSize: 18 }}
      />
    </CardView>
  );
};

export const PlannedDatesInfoIcon: React.FC = () => {
  const { primary } = useTheme().colors;

  //const navigation = useNavigation<NavigationProp<AddHomeworkStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => {
        console.warn("SHOW INFO (NOT HANDLED)");
      }}
    >
      <Ionicons
        name="ios-information-circle-outline"
        size={28}
        color={primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  secondaryHeader: {
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 18,
  },
  freeDayDate: {
    fontSize: 19,
    textAlignVertical: "bottom",
  },
  freeDayContainer: {
    justifyContent: "space-between",
    marginVertical: 5,
    marginHorizontal: 10,
  },
  freeDayInternalContainer: {
    padding: 10,
    borderWidth: 0.3,
    borderColor: "#bbb",
  },
  freeMinutes: {
    fontSize: 24,
    textAlignVertical: "bottom",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  freeDayBodyContainer: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  bodyText: {
    fontSize: 16,
  },
  bodyContainer: {
    height: "100%",
  },
  titleText: {
    marginRight: "20%",
    fontSize: 25,
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  timeLeftText: {
    fontSize: 20,
    marginBottom: 20,
  },
  selectFreeMins: {
    flexDirection: "row",
    marginHorizontal: -5,
    marginTop: 20,
  },
  selectFreeMinsBtn: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: 45,
    marginHorizontal: 5,
  },
  selectFreeMinsTimePicker: {
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexGrow: 1,
  },
  selectFreeMinsBorder: {
    borderRadius: 10,
  },
  selectFreeMinsText: {
    fontSize: 16,
  },
  percentage: {
    height: 2,
  },
  percentagesContainer: {
    flexDirection: "row",
  },
});

export default PlannedDatesScreen;
