import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import useColorScheme from "../util/useColorScheme";
import KeyboardWrapper from "../components/KeyboardWrapper";
import { View } from "../components/Themed";
import AddHomeworkInput from "../components/AddHomeworkInput";
import SolidButton from "../components/SolidButton";
import NonModalDurationPicker from "../components/NonModalDurationPicker";
import Accordion from "../components/Accordion";
import { RegularText } from "../components/StyledText";
import { Ionicons } from "@expo/vector-icons";
import { AddHomeworkStackScreenProps } from "../../types";
import { useTheme } from "@react-navigation/native";
import { useAtom } from "jotai";
import { activeSubjectAtom } from "../util/atoms";
import DateTimePicker from "react-native-modal-datetime-picker";
import { addDaysFromToday } from "../util/generalUtils";
import useInput from "../util/useInput";
import Colors from "../constants/Colors";

const AddHomeworkmodal = ({
  navigation,
}: AddHomeworkStackScreenProps<"Root">) => {
  const [activeSubject] = useAtom(activeSubjectAtom);

  const [activeSubjectHasError, setActiveSubjectHasError] = useState(false);
  const [durationDate, setDurationDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [durationHasError, setDurationHasError] = useState(false);

  const durationChangeHandler = (date: Date) => {
    setDurationDate(date);
  };

  const chooseSubjectHandler = () => {
    navigation.push("ChooseSubject");
  };

  const { card } = useTheme().colors;

  const accordionTitle = "Duration (h : m)";

  const duration = useMemo(() => {
    const dur = durationDate.getMinutes() + durationDate.getHours() * 60;
    if (dur !== 0) {
      setDurationHasError(false);
    }
    return dur;
  }, [durationDate]);

  const [isExpDateOpened, setExpDateOpened] = useState(false);
  const [expDate, setExpDate] = useState<undefined | Date>(undefined);
  const [expDateHasError, setExpDateHasError] = useState(false);

  const {
    value: titleValue,
    onChangeText: onChangeTitle,
    isValid: isTitleValid,
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
    isValid: isDescriptionValid,
    hasError: descriptionHasError,
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
  const { errorColor } = Colors[colorScheme];

  const nextStepHandler = () => {
    validateTitle();
    validateDescription();

    if (!activeSubject) {
      setActiveSubjectHasError(true);
    } else {
      setActiveSubjectHasError(false);
    }

    if (duration === 0) {
      setDurationHasError(true);
    } else {
      setDurationHasError(false);
    }

    if (!expDate) {
      setExpDateHasError(true);
    } else {
      setExpDateHasError(false);
    }
    if (
      !activeSubject ||
      duration === 0 ||
      !expDate ||
      titleHasError ||
      descriptionHasError
    ) {
      Alert.alert("Error", "Please compile the form", [
        { text: "Ok", style: "default" },
      ]);
      return;
    }

    navigation.navigate("PlannedDates", {
      title: titleValue,
      subjectId: activeSubject.id,
      description: descriptionValue,
      duration: duration,
      expirationDate: expDate.toString(),
    });
  };

  return (
    <KeyboardWrapper>
      <View
        style={[
          styles.container,
          {
            backgroundColor: card,
          },
        ]}
      >
        <ScrollView>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: card,
              },
            ]}
          >
            <AddHomeworkInput
              title="Title"
              onChangeText={onChangeTitle}
              value={titleValue}
              hasError={titleHasError}
            />
            <AddHomeworkInput
              title="Description"
              isTextArea
              maxLength={400}
              onChangeText={onChangeDescription}
              value={descriptionValue}
              hasError={descriptionHasError}
            />

            <TouchableOpacity
              onPress={chooseSubjectHandler}
              style={[styles.main]}
            >
              {activeSubject ? (
                <View
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
                </View>
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
              <Ionicons name="chevron-forward" size={24} color="#aaa" />
            </TouchableOpacity>
            <Accordion
              title={accordionTitle}
              choosedValue={`${durationDate.getHours()}h ${durationDate.getMinutes()}m`}
              hasError={durationHasError}
              isValueChoosed={duration !== 0}
            >
              <NonModalDurationPicker
                onChangeDuration={durationChangeHandler}
                value={durationDate}
              />
            </Accordion>
            <ExpirationDatePicker
              expDate={expDate}
              hasError={expDateHasError}
              onOpen={expirationDateOpenHandler}
            />
          </View>
        </ScrollView>
        <SolidButton title="Next step" onPress={nextStepHandler} />
        <DateTimePicker
          isVisible={isExpDateOpened}
          mode="date"
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

const ExpirationDatePicker: React.FC<{
  expDate: Date | undefined;
  hasError: boolean;
  onOpen: () => void;
}> = (props) => {
  const { card, text } = useTheme().colors;
  const cs = useColorScheme();
  const { errorColor } = Colors[cs];
  return (
    <TouchableOpacity
      onPress={props.onOpen}
      style={[styles.main, { backgroundColor: card }]}
    >
      <RegularText
        style={[
          styles.undefinedText,
          props.expDate ? { color: text } : {},
          props.hasError ? { color: errorColor } : {},
        ]}
      >
        {props.expDate ? props.expDate.toLocaleDateString() : "Expiration Date"}
      </RegularText>
      <TouchableOpacity onPress={props.onOpen}>
        <Ionicons name="ios-calendar-outline" size={24} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
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
    color: "#888",
  },
  main: {
    height: 55,
    borderBottomWidth: 1,
    borderColor: "#0000001e",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    flexDirection: "row",
    fontSize: 17,
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
