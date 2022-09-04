import React, { useLayoutEffect } from "react";
import { HomeStackScreenProps } from "../../types";
import { View } from "../components/Themed";

const SingleHomeworkScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"SingleHomework">) => {
  const { title, homeworkId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return <View></View>;
};

export default SingleHomeworkScreen;
