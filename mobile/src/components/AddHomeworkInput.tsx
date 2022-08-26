import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../util/useColorScheme";
import { RegularText } from "./StyledText";
import { View } from "./Themed";

interface AddHomeworkInputProps extends TextInputProps {
  title: string;
  isTextArea?: boolean;
  value: string;
  hasError: boolean;
}

const AddHomeworkInput: React.FC<AddHomeworkInputProps> = (props) => {
  const colorScheme = useColorScheme();
  const { card } = useTheme().colors;
  const { placeHolderColor, errorColor } = Colors[colorScheme];
  return (
    <View style={[styles.container, { backgroundColor: card }]}>
      <TextInput
        {...props}
        style={[
          styles.input,
          props.isTextArea ? styles.textArea : {},
          props.hasError ? { color: errorColor } : {},
        ]}
        value={props.value}
        placeholder={props.title}
        placeholderTextColor={props.hasError ? errorColor : placeHolderColor}
        {...(props.isTextArea ? { multiline: true } : { multiline: false })}
      />
      {props.isTextArea && props.maxLength ? (
        <RegularText
          style={[
            styles.limitText,
            props.value.length >= props.maxLength || props.hasError
              ? {
                  color: errorColor,
                }
              : {},
          ]}
        >{`${props.value.length} / ${props.maxLength}`}</RegularText>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 54,
    paddingHorizontal: 0,
    fontSize: 17,
  },
  textArea: {
    height: 150,
    paddingTop: 20,
    textAlignVertical: "top",
  },
  container: {
    borderBottomWidth: 1,
    borderColor: "#0000001e",
  },
  limitText: {
    fontSize: 15,
    color: "#888",
    textAlign: "right",
    padding: 10,
  },
});
export default AddHomeworkInput;
