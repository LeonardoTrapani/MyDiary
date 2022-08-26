import React, { useEffect, useState } from "react";
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

const AddHomeworkmodal = ({
  navigation,
}: AddHomeworkStackScreenProps<"Root">) => {
  const [activeSubject, setActiveSubject] = useAtom(activeSubjectAtom);

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
            <AddHomeworkInput title="Title" />
            <AddHomeworkInput title="Description" isTextArea />

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
                <RegularText style={styles.subjectText}>Subject</RegularText>
              )}
              <Ionicons name="chevron-forward" size={24} color="#aaa" />
            </TouchableOpacity>
            <Accordion title="Duration (h : m)">
              <NonModalDurationPicker
                onChangeDuration={durationChangeHandler}
                value={durationDate}
              />
            </Accordion>
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
  activeSubjectContainer: {
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  activeSubject: {
    fontSize: 17,
  },
  subjectText: {
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
