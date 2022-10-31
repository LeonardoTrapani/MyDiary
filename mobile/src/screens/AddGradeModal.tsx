import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AddGradeStackScreenProps } from "../../types";
import { addGrade } from "../api/grade";
import KeyboardWrapper from "../components/KeyboardWrapper";
import MyInput from "../components/MyInput";
import SolidButton from "../components/SolidButton";
import { RegularText } from "../components/StyledText";
import { CardView, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { activeSubjectAtom } from "../util/atoms";
import { isNumeric } from "../util/generalUtils";
import { useValidToken } from "../util/react-query-hooks";
import useColorScheme from "../util/useColorScheme";
import useInput from "../util/useInput";

const AddHomeworkModal = ({ navigation }: AddGradeStackScreenProps<"Root">) => {
  const [activeSubjectHasError, setActiveSubjectHasError] = useState(false);
  const [activeSubject] = useAtom(activeSubjectAtom);
  const { card } = useTheme().colors;

  const { data: validToken } = useValidToken();
  const addGradeMutation = useMutation(
    (gradeInfo: { grade: number; subjectId: number }) => {
      return addGrade(gradeInfo.grade, gradeInfo.subjectId, validToken);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["allGrades"]);
        navigation.pop();
      },
    }
  );

  const queryClient = useQueryClient();
  const {
    value: gradeValue,
    errorMessage: gradeErrorMessage,
    hasError: gradeHasError,
    onChangeText: onChangeGradeText,
    validate: validateGrade,
  } = useInput([
    {
      errorMessage: "only numbers accepted",
      check: (value) => {
        return isNumeric(value) && value.length > 0;
      },
    },
  ]);

  //console.log(gradeHasError);

  const colorScheme = useColorScheme();
  const { errorColor } = Colors[colorScheme];

  const chooseSubjectHandler = () => {
    navigation.push("ChooseSubject");
  };

  const onAddGrade = () => {
    validateGrade();

    if (!activeSubject) {
      setActiveSubjectHasError(true);
    } else {
      setActiveSubjectHasError(false);
    }

    if (!activeSubject || gradeHasError) {
      return;
    }

    addGradeMutation.mutate({
      grade: +gradeValue,
      subjectId: activeSubject.id,
    });
  };

  return (
    <KeyboardWrapper>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1 }}>
          <MyInput
            keyboardType="numeric"
            name="Grade"
            onBlur={validateGrade}
            hasError={gradeHasError}
            onChangeText={onChangeGradeText}
            errorMessage={gradeErrorMessage}
          />
          <TouchableOpacity
            onPress={chooseSubjectHandler}
            style={[styles.main, { backgroundColor: card }]}
          >
            {activeSubject ? (
              <CardView
                style={[
                  styles.activeSubjectContainer,
                  { backgroundColor: card },
                ]}
              >
                <RegularText style={styles.activeSubject}>
                  {activeSubject.name}
                </RegularText>
                <View
                  style={[
                    styles.coloredCircle,
                    { backgroundColor: activeSubject.color },
                  ]}
                ></View>
              </CardView>
            ) : (
              <RegularText
                style={[
                  styles.undefinedText,
                  activeSubjectHasError ? { color: errorColor } : {},
                ]}
              >
                Subject
              </RegularText>
            )}
            <Ionicons
              name="chevron-forward"
              size={24}
              color={activeSubjectHasError ? errorColor : "#aaa"}
            />
          </TouchableOpacity>
        </View>
        <SolidButton
          title="Add Grade"
          isLoading={addGradeMutation.isLoading}
          onPress={onAddGrade}
        />
      </View>
    </KeyboardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
  },
  activeSubjectContainer: {
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  activeSubject: {
    fontSize: 17,
  },
  undefinedText: {
    fontSize: 17,
    color: "#888",
  },
  label: {
    fontSize: 20,
  },
  main: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 47,
    fontSize: 18,
    borderWidth: 0,
    marginTop: 20,
    borderRadius: 8,
    flexDirection: "row",
  },
  coloredCircle: {
    height: 25,
    borderWidth: 0.2,
    marginRight: 10,
    borderColor: "#000",
    aspectRatio: 1,
    borderRadius: 1000,
  },
});

export default AddHomeworkModal;
