import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import useColorScheme from "../util/useColorScheme";
import KeyboardWrapper from "../components/KeyboardWrapper";
import { CardView, View } from "../components/Themed";
import DescriptionInput from "../components/AddHomeworkInput";
import SolidButton from "../components/SolidButton";
import { RegularText } from "../components/StyledText";
import { Ionicons } from "@expo/vector-icons";
import { AddHomeworkStackScreenProps, HomeworkInfoType } from "../../types";
import { useTheme } from "@react-navigation/native";
import { useAtom } from "jotai";
import { activeSubjectAtom } from "../util/atoms";
import DateTimePicker from "react-native-modal-datetime-picker";
import { addDaysFromToday } from "../util/generalUtils";
import useInput from "../util/useInput";
import Colors from "../constants/Colors";
import MyInput from "../components/MyInput";
import { SubjectType, useValidToken } from "../util/react-query-hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHomework } from "../api/homework";

const AddHomeworkmodal = ({
  navigation,
}: AddHomeworkStackScreenProps<"Root">) => {
  const { data: validToken } = useValidToken();

  const queryClient = useQueryClient();
  const createHomeworkMutation = useMutation(
    (homeworkInfo: HomeworkInfoType) => {
      return createHomework(validToken, {
        title: homeworkInfo.title,
        subjectId: homeworkInfo.subjectId,
        description: homeworkInfo.description,
        expirationDate: homeworkInfo.expirationDate,
        duration: homeworkInfo.duration,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["plannedCalendarDay"]);
        queryClient.invalidateQueries(["dueCalendarDay"]);
        navigation.getParent()?.goBack();
      },
    }
  );

  const [activeSubject] = useAtom(activeSubjectAtom);

  const [activeSubjectHasError, setActiveSubjectHasError] = useState(false);

  const chooseSubjectHandler = () => {
    navigation.push("ChooseSubject");
  };

  const [isExpDateOpened, setExpDateOpened] = useState(false);
  const [expDate, setExpDate] = useState<undefined | Date>(undefined);
  const [expDateHasError, setExpDateHasError] = useState(false);

  const {
    value: titleValue,
    onChangeText: onChangeTitle,
    errorMessage: titleErrorMessage,
    validate: validateTitle,
    hasError: titleHasError,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: "please enter a title",
    },
  ]);

  const {
    value: descriptionValue,
    onChangeText: onChangeDescription,
    validate: validateDescription,
    hasError: descriptionHasError,
    errorMessage: descriptionErrorMessage,
  } = useInput([
    {
      check: (value) => {
        return !!value;
      },
      errorMessage: "please enter a description",
    },
    {
      check: (value) => value.length <= 400,
      errorMessage: "the description maximum length is 400 characters",
    },
  ]);

  const expirationDateOpenHandler = () => {
    setExpDateOpened(true);
  };

  const colorScheme = useColorScheme();
  const { errorColor, placeHolderColor } = Colors[colorScheme];

  const planDatesHandler = () => {
    validateTitle();
    validateDescription();

    if (!activeSubject) {
      setActiveSubjectHasError(true);
    } else {
      setActiveSubjectHasError(false);
    }

    if (!expDate) {
      setExpDateHasError(true);
    } else {
      setExpDateHasError(false);
    }
    if (!activeSubject || !expDate || titleHasError || descriptionHasError) {
      Alert.alert("Error", "Please compile the form", [
        { text: "Ok", style: "default" },
      ]);
      return;
    }

    navigation.navigate("Duration", {
      homeworkPlanInfo: {
        title: titleValue,
        subjectId: activeSubject.id,
        description: descriptionValue,
        duration: 0,
        expirationDate: expDate.toString(),
      },
      isEditing: false,
    });
  };

  const createHomeworkHandler = () => {
    validateTitle();
    validateDescription();

    if (!activeSubject) {
      setActiveSubjectHasError(true);
    } else {
      setActiveSubjectHasError(false);
    }

    if (!expDate) {
      setExpDateHasError(true);
    } else {
      setExpDateHasError(false);
    }
    if (!activeSubject || !expDate || titleHasError || descriptionHasError) {
      Alert.alert("Error", "Please compile the form", [
        { text: "Ok", style: "default" },
      ]);
      return;
    }
    createHomeworkMutation.mutate({
      title: titleValue,
      subjectId: activeSubject.id,
      description: descriptionValue,
      expirationDate: expDate.toString(),
    });
  };

  return (
    <KeyboardWrapper>
      <View style={[styles.container]}>
        <ScrollView>
          <View style={[styles.inputContainer]}>
            <MyInput
              name="title"
              onChangeText={onChangeTitle}
              errorMessage={titleErrorMessage}
              onBlur={validateTitle}
              value={titleValue}
              hasError={titleHasError}
              style={{ marginBottom: 15 }}
            />
            <DescriptionInput
              title="description"
              maxLength={400}
              onBlur={validateDescription}
              onChangeText={onChangeDescription}
              errorMessage={descriptionErrorMessage}
              value={descriptionValue}
              hasError={descriptionHasError}
              style={{ marginBottom: 15 }}
            />
            <ExpirationDatePicker
              expDate={expDate}
              hasError={expDateHasError}
              onOpen={expirationDateOpenHandler}
              style={{ marginBottom: 15 }}
            />
            <SubjectPicker
              errorColor={errorColor}
              activeSubject={activeSubject}
              chooseSubjectHandler={chooseSubjectHandler}
              placeHolderColor={placeHolderColor}
              activeSubjectHasError={activeSubjectHasError}
              style={{ marginBottom: 15 }}
            />
          </View>
        </ScrollView>
        <CompleteButtons
          planDatesHandler={planDatesHandler}
          createHomeworkHandler={createHomeworkHandler}
        />
        <DateTimePicker
          isVisible={isExpDateOpened}
          mode="date"
          date={expDate || new Date()}
          minimumDate={addDaysFromToday(1)}
          onConfirm={(date: Date) => {
            setExpDateOpened(false);
            setExpDate(date);
            setExpDateHasError(false);
          }}
          onCancel={() => {
            setExpDateOpened(false);
          }}
        />
      </View>
    </KeyboardWrapper>
  );
};

const CompleteButtons: React.FC<{
  planDatesHandler: () => void;
  createHomeworkHandler: () => void;
}> = (props) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <SolidButton
        title="Plan"
        onPress={props.planDatesHandler}
        style={{ width: "48%", marginRight: "2%" }}
      />
      <SolidButton
        title="Create"
        onPress={props.createHomeworkHandler}
        style={{ width: "48%", marginLeft: "2%" }}
      />
    </View>
  );
};

const ExpirationDatePicker: React.FC<{
  expDate: Date | undefined;
  hasError: boolean;
  onOpen: () => void;
  style: StyleProp<ViewStyle>;
}> = (props) => {
  const { card, text } = useTheme().colors;
  const cs = useColorScheme();
  const { errorColor, placeHolderColor } = Colors[cs];
  return (
    <TouchableOpacity
      onPress={props.onOpen}
      style={[styles.main, { backgroundColor: card }, props.style]}
    >
      <RegularText
        style={[
          styles.undefinedText,
          props.hasError ? { color: errorColor } : { color: placeHolderColor },
          props.expDate ? { color: text } : {},
        ]}
      >
        {props.expDate ? props.expDate.toLocaleDateString() : "due date"}
      </RegularText>
      <TouchableOpacity onPress={props.onOpen}>
        <Ionicons
          name="ios-calendar-outline"
          size={24}
          color={placeHolderColor}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const SubjectPicker: React.FC<{
  chooseSubjectHandler: () => void;
  activeSubject: SubjectType | null;
  activeSubjectHasError: boolean;
  errorColor: string;
  placeHolderColor: string;
  style?: StyleProp<ViewStyle>;
}> = (props) => {
  const { card } = useTheme().colors;
  return (
    <TouchableOpacity
      onPress={props.chooseSubjectHandler}
      style={[styles.main, { backgroundColor: card }, props.style]}
    >
      {props.activeSubject ? (
        <CardView
          style={[styles.activeSubjectContainer, { backgroundColor: card }]}
        >
          <RegularText style={styles.activeSubject}>
            {props.activeSubject.name}
          </RegularText>
          <View
            style={[
              styles.coloredCircle,
              { backgroundColor: props.activeSubject.color },
            ]}
          ></View>
        </CardView>
      ) : (
        <RegularText
          style={[
            styles.undefinedText,
            props.activeSubjectHasError
              ? { color: props.errorColor }
              : { color: props.placeHolderColor },
          ]}
        >
          Subject
        </RegularText>
      )}
      <Ionicons
        name="chevron-forward"
        size={24}
        color={
          props.activeSubjectHasError
            ? props.errorColor
            : props.placeHolderColor
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    marginBottom: 20,
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
  },
  main: {
    height: 47,
    borderRadius: 8,
    fontSize: 18,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
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

export default AddHomeworkmodal;
