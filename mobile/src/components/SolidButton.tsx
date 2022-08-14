import {
  Pressable,
  PressableProps,
  StyleSheet,
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import { BoldText } from './StyledText';
import { useTheme } from '@react-navigation/native';

interface CustomTouchableOpacityProps extends TouchableHighlightProps {
  title: string;
}

const SolidButton: React.FC<CustomTouchableOpacityProps> = (props) => {
  const { primary, background } = useTheme().colors;
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.4}
      style={[
        styles.button,
        {
          backgroundColor: primary,
        },
        props.style,
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
