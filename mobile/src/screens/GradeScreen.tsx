import { CardView, View } from "../components/Themed";
import React from "react";
import { useAllGrades } from "../util/react-query-hooks";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BoldText, MediumText, RegularText } from "../components/StyledText";
import ErrorComponent from "../components/ErrorComponent";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GradeStackParamList, GradeStackScreenProps } from "../../types";
import Break from "../components/Break";

const GradeScreen = ({ navigation }: GradeStackScreenProps<"Root">) => {
  const {
    data: allGrades,
    isLoading: isAllGradesLoading,
    error: allGradesError,
  } = useAllGrades();

  if (isAllGradesLoading || !allGrades) {
    return <ActivityIndicator />;
  }

  const singleSubjectGradePressHandler = (i: number) => {
    const { name, color, id, grades, averageGrade } = allGrades.subjects[i];
    navigation.navigate("SubjectGrades", {
      name,
      color,
      id,
      grades,
      averageGrade,
    });
  };

  return (
    <View>
      <>
        {allGradesError && <ErrorComponent text={allGradesError as string} />}
        <RegularText>Average Grade: {allGrades?.averageGrade}</RegularText>
        <FlatList
          data={allGrades?.subjects}
          renderItem={({ item, index }) => (
            <SingleSubjectGrade
              subject={item}
              i={index}
              onPress={singleSubjectGradePressHandler}
            />
          )}
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

const SingleSubjectGrade: React.FC<{
  subject: SubjectGrade;
  onPress: (i: number) => void;
  i: number;
}> = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress(props.i);
      }}
    >
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
        <Ionicons name="ios-chevron-forward" size={25} />
      </CardView>
      <View style={{ marginLeft: 20 }}>
        <Break />
      </View>
    </TouchableOpacity>
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

export const SubjectGrades = ({
  route,
}: GradeStackScreenProps<"SubjectGrades">) => {
  const { primary } = useTheme().colors;
  return (
    <View style={{ paddingVertical: 20 }}>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <BoldText style={{ fontSize: 50 }}>{route.params.name}</BoldText>
        <View
          style={{
            backgroundColor: route.params.color,
            borderRadius: 200,
            height: 50,
            aspectRatio: 1,
          }}
        ></View>
      </View>

      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          padding: 20,
        }}
      >
        <MediumText style={{ fontSize: 18 }}>Average Grade:</MediumText>
        <MediumText style={{ fontSize: 18, color: primary }}>
          {route.params.averageGrade?.toFixed(1) || "N/A"}
        </MediumText>
      </View>
      <FlatList
        data={route.params.grades}
        renderItem={({ item, index }) => (
          <TouchableOpacity>
            <CardView
              style={{
                padding: 18,
                borderWidth: 0.8,
                borderTopWidth: index === 0 ? 0.8 : 0,
                borderColor: "#bbb",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <RegularText style={{ fontSize: 18 }}>{item.grade}</RegularText>
              <Ionicons name="ios-chevron-forward" size={25} />
            </CardView>
          </TouchableOpacity>
        )}
      />
    </View>
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
