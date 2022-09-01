import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { RootTabScreenProps } from "../../types";
import FloatingButton from "../components/FloatingButton";
import SolidButton from "../components/SolidButton";
import { View } from "../components/Themed";
import { useCalendarDay } from "../util/react-query-hooks";

const HomeworkScreen = ({ navigation }: RootTabScreenProps<"Homework">) => {
  const { primary } = useTheme().colors;
  const [page, setPage] = useState(1);
  const addHomeworkHandler = () => {
    navigation.navigate("AddHomework");
  };
  const {
    data: calendarDay,
    isLoading: isCalendarDayLoading,
    error,
    isError,
  } = useCalendarDay(page);
  console.log(calendarDay);

  return (
    <View style={styles.container}>
      <SolidButton
        title="+"
        onPress={() => {
          setPage((prev) => {
            return prev + 1;
          });
        }}
      />
      <FloatingButton
        color={primary}
        ionIconName="ios-add"
        onPress={addHomeworkHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeworkScreen;
