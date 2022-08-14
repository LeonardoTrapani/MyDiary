import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlightProps,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import { BoldText } from './StyledText';
import { useTheme } from '@react-navigation/native';
import { View } from './Themed';

interface CustomTouchableOpacityProps extends TouchableHighlightProps {
  title: string;
  isLoading: boolean;
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
      <View
        style={[
          styles.buttonContent,
          {
            backgroundColor: primary,
          },
        ]}
      >
        {props.isLoading && <ActivityIndicator color='#fff' />}
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
      </View>
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
    marginLeft: 10,
  },
  buttonContent: {
    flexDirection: 'row',
  },
});

export default SolidButton;
