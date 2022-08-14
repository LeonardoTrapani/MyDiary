import { useTheme } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { RegularText } from './StyledText';

interface CustomTouchableOpacityProps extends TouchableOpacityProps {
  title: string;
}

const TextButton: React.FC<CustomTouchableOpacityProps> = (props) => {
  const { primary } = useTheme().colors;
  return (
    <TouchableOpacity {...props}>
      <RegularText
        style={[
          props.style,
          {
            color: primary,
            fontSize: 16,
            padding: 0,
          },
        ]}
      >
        {props.title}
      </RegularText>
    </TouchableOpacity>
  );
};

export default TextButton;
