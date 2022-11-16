import React, { useMemo, useState } from "react";
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
import MyInput from "../components/MyInput";
import { SubjectType } from "../util/react-query-hooks";
import TextButton from "../components/TextButton";
import TextWithDividers from "../components/TextWithDividers";

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

  const accordionTitle = "duration (h : m)";

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

  const PlanDatesHandler = () => {
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

  const createHomeworkHandler = () => {
    console.warn("TODO: create homework without plannded dates");
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
          </View>
        </ScrollView>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <TextButton
            title="plan dates"
            onPress={PlanDatesHandler}
            textStyle={{ fontSize: 17 }}
          />
        </View>
        <TextWithDividers
          style={{
            marginVertical: 20,
            marginHorizontal: 10,
          }}
        >
          OR
        </TextWithDividers>

        <SolidButton title="Create Homework" onPress={createHomeworkHandler} />
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
