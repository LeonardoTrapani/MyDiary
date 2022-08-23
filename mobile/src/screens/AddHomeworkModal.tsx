import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, } from 'react-native';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { View } from '../components/Themed';
import useInput from '../util/useInput';
import AddHomeworkInput from '../components/AddHomeworkInput';
import SolidButton from '../components/SolidButton';
import NonModalDurationPicker from '../components/NonModalDurationPicker';
import Accordion from '../components/Accordion';
import { RegularText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { AddHomeworkStackScreenProps } from '../../types';

const AddHomeworkmodal = ({ navigation }: AddHomeworkStackScreenProps<'Root'>) => {
  const {
    errorMessage: nameErrorMessage,
    hasError: nameHasError,
    isValid: isNameValid,
    onChangeText: onNameChange,
    validate: validateName,
    value: nameValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please insert a name',
    },
    {
      check: (value) => value.length >= 3,
      errorMessage: 'insert at least 3 characters',
    },
  ]);
  const {
    errorMessage: descriptionErrorMessage,
    hasError: descriptionHasError,
    isValid: isDescriptionValid,
    onChangeText: onDescriptionChange,
    validate: validateDescription,
    value: descriptionValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please insert a description',
    },
    {
      check: (value) => value.length >= 5,
      errorMessage: 'insert at least 5 characters',
    },
    {
      check: (value) => value.length <= 400,
      errorMessage: 'insert maximum 400 character',
    },
  ]);


  const {
    errorMessage: durationErrorMessage,
    hasError: durationHasError,
    isValid: isDurationValid,
    onChangeText: onChangeDuration,
    validate: validateDuration,
    value: durationValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'insert a duration',
    },
    {
      check: (value) => +value >= 5,
      errorMessage: 'minimum 5 minutes',
    },
    {
      check: (value) => {
        try {
          +value;
        } catch {
          return false;
        }
        return true;
      },
      errorMessage: 'insert a number',
    },
  ]);

  const [durationDate, setDurationDate] = useState(new Date(new Date().setHours(0, 0, 0, 0,)))
  const durationChangeHandler = (date: Date) => {
    setDurationDate(date)
  }

  const chooseSubjectHandler = () => {
    navigation.navigate('ChooseSubject')
  }

  return (<KeyboardWrapper>
    <View style={styles.container}>
      <ScrollView>

        <View style={styles.inputContainer}>
          <AddHomeworkInput title="Title" />
          <AddHomeworkInput title="Description" isTextArea />

          <Accordion title="Duration (h : m)" >
            <NonModalDurationPicker onChangeDuration={durationChangeHandler} value={durationDate} />
          </Accordion>

          <TouchableOpacity onPress={chooseSubjectHandler} style={[styles.main]}>
            <RegularText style={styles.subjectText}>Subject</RegularText>
            <Ionicons name="chevron-forward" size={24} color="#aaa" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <SolidButton title="Next step" isLoading={false} />
    </View>
  </KeyboardWrapper>)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1
  },
  title: {
    fontSize: 25
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    flexDirection: 'row',
    fontSize: 17,
  },
})

export default AddHomeworkmodal;
