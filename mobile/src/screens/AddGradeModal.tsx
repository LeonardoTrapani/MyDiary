import React from "react";
import { GradeStackScreenProps } from "../../types";
import { View } from "../components/Themed";
import { useAllGrades } from "../util/react-query-hooks";

const AddHomeworkModal = ({ route }: GradeStackScreenProps<"Add">) => {
  const subjectId = route.params;
  console.log(subjectId);
  const { data } = useAllGrades();
  return <View></View>;
};

export default AddHomeworkModal;
