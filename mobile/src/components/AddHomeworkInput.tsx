import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface AddHomeworkInputProps extends TextInputProps {
  title: string;
  isTextArea?: boolean;
}

const AddHomeworkInput: React.FC<AddHomeworkInputProps> = (props) => {
  return <TextInput
    placeholderTextColor="#aaa"
    style={[styles.input, props.isTextArea ? styles.textArea : {}]}
    placeholder={props.title}
    {...props.isTextArea ? { multiline: true } : { multiline: false }}
  />
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    height: 55,
    borderColor: "#0000001e",
    paddingHorizontal: 0,
    fontSize: 17
  },
  textArea: {
    height: 170,
    paddingTop: 20,
    textAlignVertical: 'top'
  }
})
export default AddHomeworkInput
