import { View } from "../components/Themed";
import React from "react";
import { useAllGrades } from "../util/react-query-hooks";

const GradeScreen: React.FC = () => {
  const { data: allGrades } = useAllGrades();
  console.log(allGrades);
  return <View></View>;
};

export default GradeScreen;
