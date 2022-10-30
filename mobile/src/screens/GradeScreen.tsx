import { CardView, View } from "../components/Themed";
import React, { useEffect } from "react";
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
import ListCardComponent from "../components/ListCardComponent";
import { useAtom } from "jotai";
import { activeSubjectAtom } from "../util/atoms";

const GradeScreen = ({ navigation }: GradeStackScreenProps<"Root">) => {
  const {
    data: allGrades,
    isLoading: isAllGradesLoading,
    error: allGradesError,
  } = useAllGrades();
  const { primary } = useTheme().colors;

  const setActiveSubject = useAtom(activeSubjectAtom)[1];

  useEffect(() => {
    setActiveSubject(null);
  }, [setActiveSubject]);

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
    <View style={{ flex: 1 }}>
      <>
        {allGradesError && <ErrorComponent text={allGradesError as string} />}
        <FlatList
          data={allGrades?.subjects}
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
                paddingVertical: 20,
              }}
            >
              <RegularText style={{ fontSize: 20 }}>Average Grade:</RegularText>
              <MediumText style={{ fontSize: 22, color: primary }}>
                {allGrades?.averageGrade?.toFixed(1) || "N/A"}
              </MediumText>
            </View>
          }
          renderItem={({ item, index }) => (
            <ListCardComponent
              index={index}
              rightArrow
              onPress={singleSubjectGradePressHandler}
            >
              <SingleSubjectGrade subject={item} i={index} />
            </ListCardComponent>
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
  i: number;
}> = (props) => {
  return (
    <CardView style={styles.innerSubjectGradeContainer}>
      <CardView
        style={[styles.gradeCircle, { backgroundColor: props.subject.color }]}
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
      </CardView>
      <CardView>
        <MediumText style={styles.subjectNameText}>
          {props.subject.name}
        </MediumText>
      </CardView>
    </CardView>
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
  navigation,
}: GradeStackScreenProps<"SubjectGrades">) => {
  const { primary } = useTheme().colors;

  const setActiveSubject = useAtom(activeSubjectAtom)[1];

  useEffect(() => {
    setActiveSubject(route.params);
  }, [route.params, setActiveSubject]);

  return (
    <View style={{ paddingVertical: 20, flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          <>
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
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: route.params.color,
                    marginRight: 15,
                    borderRadius: 200,
                    height: 50,
                    aspectRatio: 1,
                  }}
                ></View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Add");
                  }}
                >
                  <Ionicons name="ios-add" size={50} color={primary} />
                </TouchableOpacity>
              </View>
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
          </>
        }
        data={route.params.grades}
        renderItem={({ item, index }) => (
          <ListCardComponent
            index={index}
            rightArrow
            onPress={() => {
              console.warn("TODO: cambio minuti");
            }}
          >
            <RegularText style={{ fontSize: 18 }}>{item.grade}</RegularText>
          </ListCardComponent>
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
