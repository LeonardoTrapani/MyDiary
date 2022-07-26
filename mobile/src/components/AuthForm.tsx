import { AxiosError } from "axios";
import React from "react";
import { View, StyleSheet, KeyboardType } from "react-native";
import { AutoCapitalize, AutoComplete } from "../../types";
import KeyboardWrapper from "./KeyboardWrapper";
import MyInput from "./MyInput";

import SolidButton from "./SolidButton";
import { BoldText } from "./StyledText";
import TextButton from "./TextButton";
import { useGetDataFromAxiosError } from "../util/axiosUtils";

import ErrorComponent from "./ErrorComponent";
import useKeyboardOpened from "../util/useKeyboardOpened";

const AuthForm: React.FC<{
  title: string;
  insteadHandler: () => void;
  insteadTitle: string;
  inputs: AuthInputType[];
  submitHandler: () => void;
  svg: JSX.Element;
  isLoading: boolean;
  hasError: boolean;
  error: AxiosError;
}> = (props) => {
  const getDataFromAxiosError = useGetDataFromAxiosError(
    props.error,
    "counldn't authenticate"
  );
  const isKeyboardOpened = useKeyboardOpened();
  return (
    <KeyboardWrapper>
      <View style={styles.container}>
        {!isKeyboardOpened && (
          <View style={[styles.svgContainer]}>{props.svg}</View>
        )}
        <View style={styles.body}>
          <View>
            {props.hasError && (
              <ErrorComponent text={getDataFromAxiosError()} />
            )}
            <BoldText style={[styles.title]}>{props.title}</BoldText>
            <View>
              {props.inputs.map((input) => {
                return (
                  <MyInput
                    key={input.name}
                    name={input.name}
                    errorMessage={input.errorMessage}
                    hasError={input.hasError}
                    keyboardType={input.keyboardType}
                    value={input.value}
                    onChangeText={input.onChangeText}
                    autoComplete={input.autoComplete}
                    autoCorrect={false}
                    onBlur={input.validate}
                    autoCapitalize={input.autoCapitalize}
                    secureTextEntry={input.secureTextEntry}
                    style={styles.applyGap}
                  />
                );
              })}
            </View>

            <SolidButton
              isLoading={props.isLoading}
              title={props.title}
              onPress={props.submitHandler}
              style={styles.submitButton}
            />
          </View>
        </View>
        {!isKeyboardOpened && (
          <TextButton
            title={props.insteadTitle}
            style={[styles.instead]}
            onPress={props.insteadHandler}
          />
        )}
      </View>
    </KeyboardWrapper>
  );
};

export const INPUT_GAP = 15;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
  },
  svgContainer: {
    height: "30%",
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  instead: {
    alignSelf: "center",
  },
  submitButton: {
    marginTop: 20,
  },
  applyGap: {
    marginVertical: INPUT_GAP / 2,
  },
});

export type AuthInputType = {
  errorMessage: string;
  hasError: boolean;
  value: string;
  onChangeText: (value: string) => void;
  autoComplete: AutoComplete;
  name: string;
  validate: () => void;
  keyboardType: KeyboardType;
  autoCapitalize: AutoCapitalize;
  secureTextEntry: boolean;
};
export default AuthForm;
