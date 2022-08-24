import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../util/useColorScheme";

interface AddHomeworkInputProps extends TextInputProps {
  title: string;
  isTextArea?: boolean;
}

const AddHomeworkInput: React.FC<AddHomeworkInputProps> = (props) => {
  const colorScheme = useColorScheme();
  const { placeHolderColor } = Colors[colorScheme];
  return (
    <TextInput
      style={[styles.input, props.isTextArea ? styles.textArea : {}]}
      placeholder={props.title}
      placeholderTextColor={placeHolderColor}
      {...(props.isTextArea ? { multiline: true } : { multiline: false })}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    height: 55,
    borderColor: "#0000001e",
    paddingHorizontal: 0,
    fontSize: 17,
  },
  textArea: {
    height: 170,
    paddingTop: 20,
    textAlignVertical: "top",
  },
});
export default AddHomeworkInput;
