import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

import globalStyles from '../constants/Syles';
import useColorScheme from '../util/useColorScheme';
import { MediumText } from './StyledText';
import { View } from './Themed';
const Error: React.FC<{
  text: string | null;
}> = (props) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={[
        styles.errorContainer,
        globalStyles.shadow,
        {
          backgroundColor: Colors[colorScheme].errorColor,
        },
      ]}
    >
      <MediumText style={[styles.errorText]}>{props.text}</MediumText>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 17,
    alignSelf: 'center',
    color: '#fff',
  },
  errorContainer: {
    padding: 15,
  },
});

export default Error;
