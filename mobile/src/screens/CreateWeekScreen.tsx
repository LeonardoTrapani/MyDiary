import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SolidButton from '../components/SolidButton';
import { BoldText } from '../components/StyledText';
import { View } from '../components/Themed';
import WeekDuration from '../components/WeekDuration';

const CreateWeekScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <BoldText style={styles.title}>
        How much free time do you have on...
      </BoldText>
      <View style={styles.durations}>
        <WeekDuration name='monday' />
        <WeekDuration name='tuesday' />
        <WeekDuration name='wednesday' />
        <WeekDuration name='thursday' />
        <WeekDuration name='friday' />
        <WeekDuration name='saturday' />
        <WeekDuration name='sunday' />
      </View>
      <SolidButton title='submit' isLoading={false} />
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
