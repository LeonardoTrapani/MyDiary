import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import FloatingButton from '../components/FloatingButton';
import { View } from '../components/Themed';

const HomeScreen: React.FC = () => {
  const { primary } = useTheme().colors;
  return (
    <View style={styles.container}>
      <FloatingButton color={primary} ionIconName='ios-add'></FloatingButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
