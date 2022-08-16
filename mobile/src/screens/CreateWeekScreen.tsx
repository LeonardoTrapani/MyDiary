import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BoldText, MediumText } from '../components/StyledText';
import WeekDuration from '../components/WeekDuration';

const CreateWeekScreen = () => {
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
