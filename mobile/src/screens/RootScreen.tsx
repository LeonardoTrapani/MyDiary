import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FloatingActionButton from '../components/FloatingActionButton';
const RootScreen: React.FC = () => {
  const { background, primary } = useTheme().colors;
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <FloatingActionButton color={primary}>
        <Ionicons name='ios-add' style={{ fontSize: 35, color: background }} />
      </FloatingActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default RootScreen;
