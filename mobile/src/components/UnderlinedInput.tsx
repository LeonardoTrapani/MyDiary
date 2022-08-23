import { useTheme } from '@react-navigation/native';
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { StyleSheet } from 'react-native';
import useColorScheme from '../util/useColorScheme';
import Colors from '../constants/Colors';
import { View } from './Themed';
import { RegularText } from './StyledText';

interface CustomInputProps extends TextInputProps {
  name: string;
  hasError: boolean;
  errorMessage: string;
}

const UnderlinedInput: React.FC<CustomInputProps> = (props) => {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  /* 
* name 
* description
* expirationDate
* plannedDates
* duration 
* subjectId
    */
  return (
    <View style={[props.style, props.hasError ? {} : {}]}>
      <TextInput
        {...props}
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            height: 40,
            fontSize: 18,
          },
          props.hasError
            ? {
              borderColor: Colors[colorScheme].errorColor,
            }
            : {},
        ]}
        placeholder={props.name}
      />
      {props.hasError && (
        <RegularText
          style={{
            color: Colors[colorScheme].errorColor,
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
    padding: 0,
    borderColor: '#0000005e',
    borderBottomWidth: 0.5
  },
  label: {
    fontSize: 20,
  },
});

export default UnderlinedInput;
