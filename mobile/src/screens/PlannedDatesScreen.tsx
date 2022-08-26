import React from "react";
import { AddHomeworkStackScreenProps } from "../../types";
import { View } from "../components/Themed";

const PlannedDatesScreen = ({
  route,
  navigation,
}: AddHomeworkStackScreenProps<"PlannedDates">) => {
  console.log(route.params);
  return <View></View>;
};

export default PlannedDatesScreen;
