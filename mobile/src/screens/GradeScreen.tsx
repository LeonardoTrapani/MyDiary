import { View } from "../components/Themed";
import React from "react";
import { useAllGrades } from "../util/react-query-hooks";
import { ActivityIndicator, FlatList } from "react-native";
import { RegularText } from "../components/StyledText";
import ErrorComponent from "../components/ErrorComponent";

const GradeScreen: React.FC = () => {
  const {
    data: allGrades,
    isLoading: isAllGradesLoading,
    error: allGradesError,
  } = useAllGrades();
  console.log(allGrades);

  if (isAllGradesLoading || !allGrades) {
    return <ActivityIndicator />;
  }
  return (
    <View>
      <>
        {allGradesError && <ErrorComponent text={allGradesError as string} />}
        <RegularText>Average Grade: {allGrades?.averageGrade}</RegularText>
        <FlatList
          data={allGrades?.subjects}
          renderItem={({ item }) => <SingleSubjectGrade subject={item} />}
        />
      </>
    </View>
  );
};

type SubjectGrade = {
  averageGrade: number | null;
  id: number;
  color: string;
  name: string;
  grades: {
    grade: number;
  }[];
};

const SingleSubjectGrade: React.FC<{ subject: SubjectGrade }> = (props) => {
  return (
    <View style={{ paddingVertical: 10 }}>
      <RegularText>{props.subject.name}</RegularText>
      <RegularText>{props.subject.averageGrade || "N/A"}</RegularText>
    </View>
  );
};

export default GradeScreen;
