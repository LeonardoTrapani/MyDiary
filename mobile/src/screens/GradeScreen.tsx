import { View } from "../components/Themed";
import React from "react";
import { useAllGrades } from "../util/react-query-hooks";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { RegularText } from "../components/StyledText";
import ErrorComponent from "../components/ErrorComponent";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GradeStackParamList } from "../../types";

const GradeScreen: React.FC = () => {
  const {
    data: allGrades,
    isLoading: isAllGradesLoading,
    error: allGradesError,
  } = useAllGrades();

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

export const AddGradeIcon: React.FC = () => {
  const { primary } = useTheme().colors;

  const navigation = useNavigation<NavigationProp<GradeStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Add");
      }}
    >
      <Ionicons name="add" color={primary} size={28} />
    </TouchableOpacity>
  );
};

export default GradeScreen;
