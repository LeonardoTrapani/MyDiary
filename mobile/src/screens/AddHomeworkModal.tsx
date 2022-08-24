import React, { useState } from "react";
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

const AddHomeworkmodal = ({
  navigation,
}: AddHomeworkStackScreenProps<"Root">) => {
  const [durationDate, setDurationDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const durationChangeHandler = (date: Date) => {
    setDurationDate(date);
  };

  const chooseSubjectHandler = () => {
    navigation.push("ChooseSubject");
  };

  return (
    <KeyboardWrapper>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.inputContainer}>
            <AddHomeworkInput title="Title" />
            <AddHomeworkInput title="Description" isTextArea />

            <Accordion title="Duration (h : m)">
              <NonModalDurationPicker
                onChangeDuration={durationChangeHandler}
                value={durationDate}
              />
            </Accordion>

            <TouchableOpacity
              onPress={chooseSubjectHandler}
              style={[styles.main]}
            >
              <RegularText style={styles.subjectText}>Subject</RegularText>
              <Ionicons name="chevron-forward" size={24} color="#aaa" />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <SolidButton title="Next step" isLoading={false} />
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
  title: {
    fontSize: 25,
  },
  input: {
    marginBottom: 20,
  },
  subjectText: {
    fontSize: 17,
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
});

export default AddHomeworkmodal;
