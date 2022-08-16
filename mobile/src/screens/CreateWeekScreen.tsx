import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyTimePicker, { useTimePicker } from '../components/MyTimePicker';
import { BoldText, MediumText } from '../components/StyledText';
import TextButton from '../components/TextButton';
import WeekDuration from '../components/WeekDuration';

const CreateWeekScreen = () => {
  const {
    isOpened: mondayIsOpened,
    onCancel: mondayOnCancel,
    onConfirm: mondayOnConfirm,
    open: mondayOpen,
    minutes: mondayMinutes,
  } = useTimePicker();

  const {
    isOpened: tuesdayIsOpened,
    onCancel: tuesdayOnCancel,
    onConfirm: tuesdayOnConfirm,
    open: tuesdayOpen,
    minutes: tuesdayMinutes,
  } = useTimePicker();

  const {
    isOpened: wednesdayIsOpened,
    onCancel: wednesdayOnCancel,
    onConfirm: wednesdayOnConfirm,
    open: wednesdayOpen,
    minutes: wednesdayMinutes,
  } = useTimePicker();

  const {
    isOpened: thursdayIsOpened,
    onCancel: thursdayOnCancel,
    onConfirm: thursdayOnConfirm,
    open: thursdayOpen,
    minutes: thursdayMinutes,
  } = useTimePicker();

  const {
    isOpened: fridayIsOpened,
    onCancel: fridayOnCancel,
    onConfirm: fridayOnConfirm,
    open: fridayOpen,
    minutes: fridayMinutes,
  } = useTimePicker();

  const {
    isOpened: saturdayIsOpened,
    onCancel: saturdayOnCancel,
    onConfirm: saturdayOnConfirm,
    open: saturdayOpen,
    minutes: saturdayMinutes,
  } = useTimePicker();

  const {
    isOpened: sundayIsOpened,
    onCancel: sundayOnCancel,
    onConfirm: sundayOnConfirm,
    open: sundayOpen,
    minutes: sundayMinutes,
  } = useTimePicker();

  return (
    <SafeAreaView>
      <MediumText style={styles.oneMoreStepToGo}>
        One more step to go...
      </MediumText>
      <BoldText style={styles.title}>
        How much free time do you have on...
      </BoldText>
      <WeekDuration name='monday' />
      <WeekDuration name='tuesday' />
      <WeekDuration name='wednesday' />
      <WeekDuration name='thursday' />
      <WeekDuration name='friday' />
      <WeekDuration name='saturday' />
      <WeekDuration name='sunday' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  oneMoreStepToGo: {
    fontSize: 20,
  },
  title: {
    letterSpacing: -0.4,
    fontSize: 40,
  },
});

export default CreateWeekScreen;
