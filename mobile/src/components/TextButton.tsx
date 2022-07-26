import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { MediumText } from "./StyledText";

interface CustomTouchableOpacityProps extends TouchableOpacityProps {
  title: string;
  textStyle?: StyleProp<TextStyle>;
}

const TextButton: React.FC<CustomTouchableOpacityProps> = (props) => {
  const { primary } = useTheme().colors;
  return (
    <TouchableOpacity {...props}>
      <MediumText
        style={[
          {
            color: primary,
            fontSize: 16,
            padding: 0,
          },
          props.textStyle,
        ]}
      >
        {props.title}
      </MediumText>
    </TouchableOpacity>
  );
};

export default TextButton;
