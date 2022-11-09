import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { AddGradeStackScreenProps } from "../../types";
import { addGrade } from "../api/grade";
import KeyboardWrapper from "../components/KeyboardWrapper";
import MyInput from "../components/MyInput";
import SolidButton from "../components/SolidButton";
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import { activeSubjectAtom } from "../util/atoms";
import { isNumeric } from "../util/generalUtils";
import { useValidToken } from "../util/react-query-hooks";
import useColorScheme from "../util/useColorScheme";
import useInput from "../util/useInput";
import { SubjectPicker } from "./AddHomeworkModal";

const AddHomeworkModal = ({ navigation }: AddGradeStackScreenProps<"Root">) => {
  const [activeSubjectHasError, setActiveSubjectHasError] = useState(false);
  const [activeSubject] = useAtom(activeSubjectAtom);

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
      check: (value) => {
        return !!value;
      },
      errorMessage: "please enter a grade",
    },
    {
      errorMessage: "only numbers accepted",
      check: (value) => {
        return isNumeric(value) && value.length > 0;
      },
    },
  ]);

  const colorScheme = useColorScheme();
  const { errorColor, placeHolderColor } = Colors[colorScheme];

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

    if (!activeSubject || gradeHasError || gradeValue.length < 1) {
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
          <SubjectPicker
            activeSubjectHasError={activeSubjectHasError}
            chooseSubjectHandler={chooseSubjectHandler}
            activeSubject={activeSubject}
            errorColor={errorColor}
            placeHolderColor={placeHolderColor}
            style={{ marginTop: 15 }}
          />
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

export default AddHomeworkModal;
