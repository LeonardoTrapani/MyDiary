import { CardView, View } from "../components/Themed";
import React from "react";
import { useAllGrades } from "../util/react-query-hooks";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MediumText, RegularText } from "../components/StyledText";
import ErrorComponent from "../components/ErrorComponent";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GradeStackParamList } from "../../types";
import Break from "../components/Break";

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
    <>
      <CardView style={styles.subjectGradeContainer}>
        <CardView style={styles.innerSubjectGradeContainer}>
          <View
            style={[
              styles.gradeCircle,
              { backgroundColor: props.subject.color },
            ]}
          >
            <CardView style={styles.innerGradeCircle}>
              {props.subject.averageGrade ? (
                <MediumText style={styles.gradeText}>
                  {props.subject.averageGrade.toFixed(1)}
                </MediumText>
              ) : (
                <MediumText style={styles.NAGradeText}>N/A</MediumText>
              )}
            </CardView>
          </View>
          <CardView>
            <MediumText style={styles.subjectNameText}>
              {props.subject.name}
            </MediumText>
          </CardView>
        </CardView>
        <RegularText>BLA BLA METTO STATO E FRECCIA QUI</RegularText>
      </CardView>
      <View style={{ marginLeft: 20 }}>
        <Break />
      </View>
    </>
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

const styles = StyleSheet.create({
  innerSubjectGradeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  subjectGradeContainer: {
    paddingVertical: 17,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  gradeCircle: {
    aspectRatio: 1,
    marginRight: 25,
    height: 55,
    borderRadius: 1000,
  },
  innerGradeCircle: {
    flex: 1,
    margin: 2,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  gradeText: {
    fontSize: 21,
  },
  NAGradeText: {
    fontSize: 18,
    color: "#888",
  },
  subjectNameText: {
    fontSize: 18,
  },
});

export default GradeScreen;
