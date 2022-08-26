import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
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

const AddHomeworkmodal = ({
  navigation,
}: AddHomeworkStackScreenProps<"Root">) => {
  const [activeSubject] = useAtom(activeSubjectAtom);

  const [durationDate, setDurationDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const durationChangeHandler = (date: Date) => {
    setDurationDate(date);
  };

  const chooseSubjectHandler = () => {
    navigation.push("ChooseSubject");
  };

  const { card } = useTheme().colors;

  const accordionTitle = "Duration (h : m)";

  const duration = useMemo(() => {
    return durationDate.getMinutes() + durationDate.getHours() * 60;
  }, [durationDate]);

  const [isExpDateOpened, setExpDateOpened] = useState(false);
  const [expDate, setExpDate] = useState<undefined | Date>(undefined);

  const { value: titleValue, onChangeText: onChangeTitle } = useInput([
    {
      check: (value) => !!value,
      errorMessage: "please enter a title",
    },
  ]);

  const { value: descriptionValue, onChangeText: onChangeDescription } =
    useInput([
      {
        check: (value) => !!value,
        errorMessage: "please enter a description",
      },
      {
        check: (value) => +value <= 400,
        errorMessage: "the description maximum length is 400 characters",
      },
    ]);

  const expirationDateOpenHandler = () => {
    setExpDateOpened(true);
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
            />
            <AddHomeworkInput
              title="Description"
              isTextArea
              maxLength={400}
              onChangeText={onChangeDescription}
              value={descriptionValue}
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
                <RegularText style={styles.undefinedText}>Subject</RegularText>
              )}
              <Ionicons name="chevron-forward" size={24} color="#aaa" />
            </TouchableOpacity>
            <Accordion
              title={accordionTitle}
              choosedValue={`${durationDate.getHours()}h ${durationDate.getMinutes()}m`}
              isValueChoosed={duration !== 0}
            >
              <NonModalDurationPicker
                onChangeDuration={durationChangeHandler}
                value={durationDate}
              />
            </Accordion>
            <ExpirationDatePicker
              expDate={expDate}
              onOpen={expirationDateOpenHandler}
            />
          </View>
        </ScrollView>
        <SolidButton title="Next step" isLoading={false} />
        <DateTimePicker
          isVisible={isExpDateOpened}
          mode="date"
          minimumDate={addDaysFromToday(1)}
          onConfirm={(date: Date) => {
            setExpDateOpened(false);
            setExpDate(date);
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
  onOpen: () => void;
}> = (props) => {
  const { card, text } = useTheme().colors;

  return (
    <TouchableOpacity
      onPress={props.onOpen}
      style={[styles.main, { backgroundColor: card }]}
    >
      <RegularText
        style={[styles.undefinedText, props.expDate ? { color: text } : {}]}
      >
        {props.expDate ? props.expDate.toLocaleDateString() : "Expiration Date"}
      </RegularText>
      <TouchableOpacity onPress={props.onOpen}>
        <Ionicons name="ios-calendar-outline" size={24} />
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
