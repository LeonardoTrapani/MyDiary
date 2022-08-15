import { AxiosError } from 'axios';
import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardType,
  KeyboardAvoidingView,
} from 'react-native';
import { AutoCapitalize, AutoComplete } from '../../types';
import MyInput from './MyInput';

import SolidButton from './SolidButton';
import { BoldText } from './StyledText';
import TextButton from './TextButton';
import { useGetDataFromAxiosError } from '../util/axiosUtils';

import Error from './Error';
import useKeyboardOpened from '../util/useKeyboardOpened';

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
    <KeyboardAvoidingView behavior='padding'>
      <SafeAreaView>
        <View style={styles.container}>
          <View
            style={[
              styles.svgContainer,
              isKeyboardOpened ? { height: '30%' } : {},
            ]}
          >
            {props.svg}
          </View>
          <View style={styles.body}>
            <View>
              {props.hasError && <Error text={getDataFromAxiosError()} />}
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
            {!isKeyboardOpened && (
              <TextButton
                title={props.insteadTitle}
                style={[styles.instead]}
                onPress={props.insteadHandler}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export const INPUT_GAP = 15;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
  },
  svgContainer: {
    height: '40%',
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  instead: {
    alignSelf: 'center',
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
