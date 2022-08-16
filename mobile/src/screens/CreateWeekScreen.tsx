import * as SecureStore from 'expo-secure-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createWeek } from '../api/week';
import SolidButton from '../components/SolidButton';
import { BoldText } from '../components/StyledText';
import { View } from '../components/Themed';
import WeekDuration from '../components/WeekDuration';
import { Week } from '../util/react-query-hooks';
import Error from '../components/Error';
import { useGetDataFromAxiosError } from '../util/axiosUtils';
import { AxiosError } from 'axios';

const CreateWeekScreen = () => {
  const queryClient = useQueryClient();

  const [mondayVal, setMondayVal] = useState(0);
  const [tuesdayVal, setTuesdayVal] = useState(0);
  const [wednesDayVal, setWednesDayVal] = useState(0);
  const [thursdayVal, setThursdayVal] = useState(0);
  const [fridayVal, setFridayVal] = useState(0);
  const [saturdayal, setSaturdayal] = useState(0);
  const [sundayVal, setSundayVal] = useState(0);
  const createWeekMutation = useMutation(
    (weekInfo: Week) => {
      return createWeek(weekInfo);
    },
    {
      onSuccess: async () => {
        await SecureStore.setItemAsync('weekCreated', JSON.stringify(true));

        queryClient.invalidateQueries(['isWeekCreated']);
      },
    }
  );
  const submitWeekHandler = () => {
    createWeekMutation.mutate({
      mondayFreeMinutes: mondayVal,
      tuesdayFreeMinutes: tuesdayVal,
      wednesdayFreeMinutes: wednesDayVal,
      thursdayFreeMinutes: thursdayVal,
      fridayFreeMinutes: fridayVal,
      saturdayFreeMinutes: saturdayal,
      sundayFreeMinutes: sundayVal,
    });
  };

  const buttonPressHandler = () => {
    Alert.alert('Submit', 'Are you sure you want to submit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit', style: 'default', onPress: submitWeekHandler },
    ]);
  };
  const getDataFromAxiosError = useGetDataFromAxiosError(
    createWeekMutation.error as AxiosError,
    'an error has occurred creating the week'
  );
  return (
    <SafeAreaView style={styles.container}>
      {!createWeekMutation.isError && (
        <BoldText style={styles.title}>
          How much free time do you have on...
        </BoldText>
      )}
      {createWeekMutation.isError && <Error text={getDataFromAxiosError()} />}
      <View style={styles.durations}>
        <WeekDuration
          name='Monday'
          onSetValue={setMondayVal}
          minutes={mondayVal}
        />
        <WeekDuration
          name='Tuesday'
          onSetValue={setTuesdayVal}
          minutes={tuesdayVal}
        />
        <WeekDuration
          name='Wednesday'
          onSetValue={setWednesDayVal}
          minutes={wednesDayVal}
        />
        <WeekDuration
          name='Thursday'
          onSetValue={setThursdayVal}
          minutes={thursdayVal}
        />
        <WeekDuration
          name='Friday'
          onSetValue={setFridayVal}
          minutes={fridayVal}
        />
        <WeekDuration
          name='Saturday'
          onSetValue={setSaturdayal}
          minutes={saturdayal}
        />
        <WeekDuration
          name='Sunday'
          onSetValue={setSundayVal}
          minutes={sundayVal}
        />
      </View>
      <SolidButton
        title='submit'
        isLoading={createWeekMutation.isLoading}
        onPress={buttonPressHandler}
      />
    </SafeAreaView>
  );
};

const titleLineHeight = 34;
const styles = StyleSheet.create({
  oneMoreStepToGo: {
    fontSize: 20,
  },
  title: {
    paddingTop: 4,
    letterSpacing: -0.4,
    fontSize: 40,
    lineHeight: titleLineHeight,
    // backgroundColor: 'red',
    marginRight: '30%',
  },
  container: {
    height: '100%',
    padding: 20,
  },
  durations: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
});

export default CreateWeekScreen;
