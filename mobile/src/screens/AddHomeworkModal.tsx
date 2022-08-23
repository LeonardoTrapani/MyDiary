import React, { useMemo, useState } from 'react';
import { StyleSheet, } from 'react-native';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { View } from '../components/Themed';
import useInput from '../util/useInput';
import AddHomeworkInput from '../components/AddHomeworkInput';
import SolidButton from '../components/SolidButton';
import NonModalDurationPicker from '../components/NonModalDurationPicker';
import Accordion from '../components/Accordion';
import MinutesToHoursMinutes from '../components/MinutesToHourMinuets';

const AddHomeworkmodal: React.FC = () => {
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


  return (<KeyboardWrapper>
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <AddHomeworkInput title="Title" />
        <AddHomeworkInput title="Description" isTextArea />
        <View style={[styles.input,]}>
          <Accordion title="Duration (h : m)" >
            <NonModalDurationPicker onChangeDuration={durationChangeHandler} value={durationDate} />
          </Accordion>
        </View>
      </View>
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
})

export default AddHomeworkmodal;
