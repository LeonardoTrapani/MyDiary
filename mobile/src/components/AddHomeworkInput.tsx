import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../util/useColorScheme";
import { RegularText } from "./StyledText";
import { View } from "./Themed";

interface AddHomeworkInputProps extends TextInputProps {
  title: string;
  value: string;
  errorMessage: string;
  hasError: boolean;
}

const DescriptionInput: React.FC<AddHomeworkInputProps> = (props) => {
  const colorScheme = useColorScheme();
  const { card } = useTheme().colors;
  const { placeHolderColor, errorColor } = Colors[colorScheme];
  return (
    <View style={props.style}>
      <View style={[styles.container, { backgroundColor: card }]}>
        <TextInput
          {...props}
          style={[
            styles.input,
            styles.textArea,
            props.hasError ? { color: errorColor } : {},
          ]}
          value={props.value}
          placeholder={props.title}
          onBlur={props.onBlur}
          placeholderTextColor={props.hasError ? errorColor : placeHolderColor}
          multiline={true}
        />
        {props.maxLength ? (
          <RegularText
            style={[
              styles.limitText,
              props.value.length >= props.maxLength || props.hasError
                ? {
                    color: errorColor,
                  }
                : { color: placeHolderColor },
            ]}
          >{`${props.value.length} / ${props.maxLength}`}</RegularText>
        ) : (
          <></>
        )}
      </View>
      {props.hasError ? (
        <RegularText
          style={{ color: errorColor, paddingLeft: 14, paddingTop: 3 }}
        >
          {props.errorMessage}
        </RegularText>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    paddingHorizontal: 14,
  },
  textArea: {
    height: 140,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  container: {
    borderRadius: 8,
    borderColor: "#0000001e",
  },
  limitText: {
    fontSize: 15,
    textAlign: "right",
    padding: 10,
  },
});
export default DescriptionInput;
