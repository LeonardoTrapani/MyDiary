import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { BoldText } from "../components/StyledText";
import { View } from "../components/Themed";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";

export const MyHomeworkHeader: React.FC<{
  onToday: () => void;
  onSetCalendarDate: (date: string) => void;
  currentCalendarDate: string;
  onPageForward: () => void;
  onPageBackward: () => void;
}> = (props) => {
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);

  const onShowCalendar = () => {
    setIsCalendarOpened(true);
  };

  const { primary } = useTheme().colors;

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onShowCalendar}>
          <BoldText style={[styles.bigDate, { color: primary }]}>
            {moment(props.currentCalendarDate).toDate().toDateString()}
          </BoldText>
        </TouchableOpacity>
        <View style={styles.navigationContainer}>
          <HeaderNavigation
            date={moment(props.currentCalendarDate).toDate()}
            onPageForward={props.onPageForward}
            onPageBackward={props.onPageBackward}
            onToday={props.onToday}
          />

          <DateTimePicker
            date={moment(props.currentCalendarDate).toDate()}
            mode="date"
            isVisible={isCalendarOpened}
            onConfirm={(date) => {
              setIsCalendarOpened(false);
              props.onSetCalendarDate(
                moment(date).startOf("day").toISOString()
              );
            }}
            onCancel={() => {
              setIsCalendarOpened(false);
            }}
          />
        </View>
      </View>
    </>
  );
};

const HeaderNavigation: React.FC<{
  date: Date;
  onPageForward: () => void;
  onPageBackward: () => void;
  onToday: () => void;
}> = (props) => {
  return (
    <View style={[styles.dateChangeButton]}>
      <DateChangeBack onPress={props.onPageBackward} />
      <DateToToday onPress={props.onToday} />
      <DateChangeFront onPress={props.onPageForward} />
    </View>
  );
};

const DateToToday: React.FC<{
  onPress: () => void;
}> = (props) => {
  const { primary } = useTheme().colors;
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Ionicons name="pin-sharp" size={24} color={primary} />
    </TouchableOpacity>
  );
};

const DateChangeBack: React.FC<{
  onPress: () => void;
}> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Ionicons name="ios-chevron-back" size={34} />
    </TouchableOpacity>
  );
};

const DateChangeFront: React.FC<{ onPress: () => void }> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Ionicons name="ios-chevron-forward" size={34} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateChangeButton: {
    height: 32,
    marginVertical: 10,
    borderRadius: 10000,
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateChangeDateText: {
    textAlign: "center",
    fontSize: 16,
  },
  dateChangeContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  homeworkBodyContainer: {
    flex: 1,
  },
  homeworkText: {
    fontSize: 15,
  },
  headerContainer: {
    padding: 10,
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    width: 50,
  },
  subheaderRight: {
    marginRight: 10,
  },
  headerleft: {
    marginLeft: 10,
  },
  bigDate: {
    fontSize: 28,
    letterSpacing: -0.8,
  },
  calendarDayHomeworkContainer: {
    flexDirection: "row",
    paddingBottom: 5,
  },
  homeworkListSectionHeader: {
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingBottom: 3,
  },

  homeworkListSectionHeaderText: {
    fontSize: 17,
    opacity: 0.8,
  },
});
