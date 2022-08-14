import {
  Pressable,
  PressableProps,
  StyleSheet,
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import { BoldText, MediumText } from './StyledText';
import { useTheme } from '@react-navigation/native';
import useColorScheme from '../util/useColorScheme';
import Colors from '../constants/Colors';

interface CustomTouchableOpacityProps extends TouchableHighlightProps {
  title: string;
}

const SolidButton: React.FC<CustomTouchableOpacityProps> = (props) => {
  const { primary, background } = useTheme().colors;
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      {...props}
      style={[
        styles.button,
        {
          backgroundColor: primary,
        },
      ]}
    >
      <BoldText
        style={[
          styles.text,
          {
            color: background,
          },
        ]}
      >
        {props.title}
      </BoldText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  text: {
    fontSize: 23,
    textTransform: 'uppercase',
  },
});

export default SolidButton;
