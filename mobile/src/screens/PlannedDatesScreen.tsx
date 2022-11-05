import { useTheme } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  AddHomeworkStackScreenProps,
  FreeDayType,
  FreeDaysType,
  SelectedDay,
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
import { createHomework } from "../api/homework";
import { useGetDataFromAxiosError } from "../util/axiosUtils";
import { AxiosError } from "axios";
import ErrorComponent from "../components/ErrorComponent";
import { useAtom } from "jotai";
import { activeInfoDayAtom } from "../util/atoms";

const PlannedDatesScreen = ({
  route,
  navigation,
}: AddHomeworkStackScreenProps<"PlannedDates">) => {
  const { isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, data } =
    useFreeDays(route.params);
  const { data: validToken } = useValidToken();

  const queryClient = useQueryClient();
  const createHomeworkMutation = useMutation(
    () => {
      return createHomework(validToken, route.params, selectedDays);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["calendarDay"]);
        navigation.getParent()?.goBack();
      },
    }
  );
  const freeDays = useMemo(() => {
    return data?.pages.map((page) => page.page.freeDays).flat();
  }, [data?.pages]);

  const [selectedDays, setSelectedDays] = useState<SelectedDay[]>([]);

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
    if (route.params.duration - totalAssignedMinutes !== 0) {
      return Alert.alert(
        "Can't create homework",
        "Assign all the time to create the homework",
        [{ text: "Ok" }]
      );
    }
    createHomeworkMutation.mutate();
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
    createHomeworkMutation.error as AxiosError,
    "an error has occurred creating the homework"
  );

  const { text } = useTheme().colors;

  const [, setActiveInfoDay] = useAtom(activeInfoDayAtom);

  return (
    <>
      <PlannedDatesSecondaryHeader
        timeToAssign={route.params.duration - totalAssignedMinutes}
        isCreateHomeworkLoading={createHomeworkMutation.isLoading}
        onCreate={createHomeworkHandler}
        hasError={createHomeworkMutation.isError}
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
                totalTimeToAssign={route.params.duration - totalAssignedMinutes}
                isFetchingNextPage={isFetchingNextPage}
                loadMore={loadMore}
                onChange={assignedMinutesChangeHandler}
                totalDuration={route.params.duration}
                onInfo={(i) => {
                  if (!freeDays) return;
                  setActiveInfoDay({
                    date: freeDays[i].date,
                    minutesToAssign: freeDays[i].minutesToAssign,
                    initialFreeTime: freeDays[i].freeMins,
                  });
                  navigation.navigate("info");
                }}
              />
            ) : (
              <RegularText style={{ fontSize: 17 }}>
                No free days found
              </RegularText>
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
}> = ({
  freeDays,
  onChange,
  loadMore,
  totalDuration,
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
                onChange={onChange}
                totalDuration={totalDuration}
                i={index}
                totalTimeToAssign={totalTimeToAssign}
                onInfo={(i) => {
                  onInfo(i);
                }}
              />
              {showLoading && <ActivityIndicator color={text} />}
              {freeDays && index === freeDays?.length - 1 && (
                <View style={{ height: bottom * 2 }}></View>
              )}
            </>
          );
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
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
  onInfo: (i: number) => void;
}> = (props) => {
  const formattedDate = new Date(props.freeDay.date).toDateString();
  const [assignedMinutes, setAssignedMinutes] = useState(0);
  //navigation.setOptions({ title: 'Updated!' })
  const { card } = useTheme().colors;
  return (
    <View style={styles.freeDayContainer}>
      <TouchableOpacity onPress={() => props.onInfo(props.i)}>
        <Ionicons name="information-circle-outline" size={25} />
      </TouchableOpacity>
      <PercentageAssignedTime
        totalDuration={props.totalDuration}
        assignedTime={assignedMinutes}
      />
      <View
        style={[
          styles.freeDayInternalContainer,
          globalStyles.smallShadow,
          { backgroundColor: card },
        ]}
      >
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
      </View>
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
    <TouchableOpacity
      style={[styles.selectFreeMinsBorder, styles.selectFreeMinsBtn]}
      onPress={props.onPress}
    >
      <RegularText style={styles.selectFreeMinsText}>{props.title}</RegularText>
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
        onPress={() => {
          setIsOpened(true);
        }}
        style={[styles.selectFreeMinsBorder, styles.selectFreeMinsTimePicker]}
      >
        <BoldText style={[{ color: primary }, styles.selectFreeMinsText]}>
          {minutesToHoursMinutesFun(props.assignedMinutes)}
        </BoldText>
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
      <View
        style={[styles.percentage, { flexGrow: 1, backgroundColor: "#ddd" }]}
      ></View>
    </CardView>
  );
};

const PlannedDatesSecondaryHeader: React.FC<{
  onCreate: () => void;
  hasError: boolean;
  error: string | null;
  timeToAssign: number;
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
        title="create homework"
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
    marginVertical: 10,
    marginHorizontal: 20,
  },
  freeDayInternalContainer: {
    padding: 20,
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
    borderWidth: 1,
    borderColor: "#888",
  },
  selectFreeMinsText: {
    fontSize: 16,
  },
  percentage: {
    height: 3,
  },
  percentagesContainer: {
    flexDirection: "row",
  },
});

export default PlannedDatesScreen;
