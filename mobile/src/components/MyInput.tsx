import { useTheme } from "@react-navigation/native";
import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { StyleSheet } from "react-native";
import useColorScheme from "../util/useColorScheme";
import Colors from "../constants/Colors";
import { View } from "./Themed";
import { RegularText } from "./StyledText";

interface CustomInputProps extends TextInputProps {
  name: string;
  hasError: boolean;
  errorMessage: string;
}

const MyInput: React.FC<CustomInputProps> = (props) => {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const { placeHolderColor, errorColor } = Colors[colorScheme];

  return (
    <View style={[props.style, props.hasError ? {} : {}]}>
      <TextInput
        {...props}
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
          },
        ]}
        placeholder={props.name}
        placeholderTextColor={props.hasError ? errorColor : placeHolderColor}
      />
      {props.hasError && (
        <RegularText
          style={{
            marginTop: 2,
            marginLeft: 10,
            color: errorColor,
          }}
        >
          {props.errorMessage}
        </RegularText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 14,
    borderWidth: 0,
    height: 47,
    fontSize: 18,
    borderRadius: 8,
  },
  label: {
    fontSize: 20,
  },
});

export default MyInput;
