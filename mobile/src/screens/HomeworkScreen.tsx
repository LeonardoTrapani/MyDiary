import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { RootTabScreenProps } from '../../types';
import FloatingButton from '../components/FloatingButton';
import { View } from '../components/Themed';

const HomeworkScreen = ({ navigation }: RootTabScreenProps<'Homework'>) => {
  const { primary } = useTheme().colors;
  const addHomeworkHandler = () => {
    navigation.navigate('AddHomework');
  };
  return (
    <View style={styles.container}>
      <FloatingButton
        color={primary}
        ionIconName='ios-add'
        onPress={addHomeworkHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeworkScreen;
