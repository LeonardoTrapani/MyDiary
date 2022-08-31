import { useTheme } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  AddHomeworkStackScreenProps,
  FreeDay,
  FreeDays,
  SelectedDay,
} from "../../types";
import { BoldText, MediumText, RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import globalStyles from "../constants/Syles";
import { useFreeDays } from "../util/react-query-hooks";
import { minutesToHoursMinutesFun } from "../util/generalUtils";
import MyDurationPicker from "../components/MyDurationPicker";

const PlannedDatesScreen = ({
  route,
}: AddHomeworkStackScreenProps<"PlannedDates">) => {
  const { isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, data } =
    useFreeDays(route.params);

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

  const { text } = useTheme().colors;
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator color={text} />
      ) : (
        <View style={styles.bodyContainer}>
          <BoldText style={styles.titleText}>
            When are you planning to do this homework?
          </BoldText>
          <RegularText style={styles.timeLeftText}>
            Time left to assig:{" "}
            {minutesToHoursMinutesFun(
              route.params.duration - totalAssignedMinutes
            )}
          </RegularText>
          <FreeDayList
            freeDays={freeDays}
            totalTimeToAssign={route.params.duration - totalAssignedMinutes}
            isFetchingNextPage={isFetchingNextPage}
            loadMore={loadMore}
            onChange={assignedMinutesChangeHandler}
          />
        </View>
      )}
    </View>
  );
};

const FreeDayList: React.FC<{
  freeDays: FreeDays | undefined;
  onChange: (minutes: number, i: number) => void;
  loadMore: () => void;
  isFetchingNextPage: boolean;
  totalTimeToAssign: number;
}> = ({
  freeDays,
  onChange,
  loadMore,
  isFetchingNextPage,
  totalTimeToAssign,
}) => {
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
                i={index}
                totalTimeToAssign={totalTimeToAssign}
              />
              {showLoading && <ActivityIndicator color={text} />}
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
  freeDay: FreeDay;
  i: number;
  totalTimeToAssign: number;
  onChange: (minutes: number, i: number) => void;
}> = (props) => {
  const formattedDate = new Date(props.freeDay.date).toDateString();
  const [assignedMinutes, setAssignedMinutes] = useState(
    props.freeDay.freeMins - props.freeDay.minutesToAssign
  );
  const { card } = useTheme().colors;
  return (
    <View
      style={[
        styles.freeDayContainer,
        globalStyles.smallShadow,
        { backgroundColor: card },
      ]}
    >
      <MediumText style={styles.freeDayDate}>{formattedDate}</MediumText>
      <SelectFreeMinsComponent
        timeToAssign={props.totalTimeToAssign}
        onChangeMintes={(minutes) => {
          setAssignedMinutes(minutes);
          props.onChange(minutes, props.i);
        }}
        assignedMinutes={assignedMinutes}
      />
    </View>
  );
};

const SelectFreeMinsComponent: React.FC<{
  onChangeMintes: (mintes: number) => void;
  assignedMinutes: number;
  timeToAssign: number;
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
    if (props.timeToAssign < 5) {
      props.onChangeMintes(props.assignedMinutes + props.timeToAssign);
      return;
    }
    props.onChangeMintes(props.assignedMinutes + 5);
  };
  const maxHandler = () => {
    props.onChangeMintes(props.timeToAssign + props.assignedMinutes);
  };
  const pickerChangeHandler = (minutes: number) => {
    if (minutes > props.timeToAssign) {
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
  assignedMinutes: number;
  timeToAssign: number;
}> = (props) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <MyDurationPicker
        isVisible={isOpened}
        defaultMinutes={props.assignedMinutes % 60}
        deafaultHours={Math.floor(props.assignedMinutes / 60)}
        maximumTime={props.assignedMinutes + props.timeToAssign}
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
        <BoldText style={styles.selectFreeMinsText}>
          {minutesToHoursMinutesFun(props.assignedMinutes)}
        </BoldText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  freeDayDate: {
    fontSize: 19,
    textAlignVertical: "bottom",
  },
  freeDayContainer: {
    justifyContent: "space-between",
    marginVertical: 10,
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
  },
  bodyText: {
    fontSize: 16,
  },
  bodyContainer: {
    marginHorizontal: 20,
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
});

export default PlannedDatesScreen;
