import React from 'react';
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyInput from '../components/MyInput';
import SolidButton from '../components/SolidButton';
import { BoldText } from '../components/StyledText';

import AuthSvg from '../components/svgs/AuthSvg';
import TextButton from '../components/TextButton';
import { View } from '../components/Themed';
import useInput, {
  emailValidCheck,
  passwordInputChecks,
} from '../util/useInput';

export const Login: React.FC = () => {
  const {
    errorMessage: emailErrorMessage,
    hasError: emailHasError,
    isValid: emailIsValid,
    onChangeText: emailOnChangeText,
    validate: emailValidate,
    value: emailValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please enter an email',
    },
    {
      check: emailValidCheck,
      errorMessage: 'please enter a valid email',
    },
  ]);

  const {
    errorMessage: passwordErrorMessage,
    hasError: passwordHasError,
    isValid: passwordIsValid,
    onChangeText: passwordOnChangeText,
    validate: passwordValidate,
    value: passwordValue,
  } = useInput(passwordInputChecks);

  const isFormValid = passwordIsValid && emailIsValid;
  const submitLoginHandler = () => {
    if (isFormValid) {
      console.log({ emailValue, passwordValue });
    } else {
      emailValidate();
      passwordValidate();
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding'>
      <SafeAreaView style={styles.container}>
        <View style={styles.svg}>
          <AuthSvg />
        </View>
        <View style={styles.loginBodyContainer}>
          <View style={styles.loginBody}>
            <BoldText style={[styles.title]}>Login</BoldText>
            <View>
              <MyInput
                name='email'
                errorMessage={emailErrorMessage}
                hasError={emailHasError}
                keyboardType='email-address'
                autoCapitalize='none'
                value={emailValue}
                onChangeText={emailOnChangeText}
                autoComplete='email'
                onBlur={emailValidate}
                style={[styles.input, styles.applyInputGap]}
              />
              <MyInput
                name='password'
                errorMessage={passwordErrorMessage}
                hasError={passwordHasError}
                secureTextEntry
                autoCapitalize='none'
                value={passwordValue}
                autoComplete='password'
                keyboardType='visible-password'
                onChangeText={passwordOnChangeText}
                onBlur={passwordValidate}
                style={[styles.input, styles.applyInputGap]}
              />
              <TextButton title='signup instead' style={styles.applyInputGap} />
            </View>

            <SolidButton title='Login' onPress={submitLoginHandler} />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export const Signup: React.FC = () => {
  return <Text>SIGNUP</Text>;
};

const inputGaps = 12;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    display: 'flex',
    justifyContent: 'center',
    height: Dimensions.get('window').height,
  },
  title: {
    fontSize: 50,
  },
  svg: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBody: {
    paddingVertical: 40,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  loginBodyContainer: {
    flex: 2,
  },
  input: {
    paddingVertical: 2,
  },
  applyInputGap: {
    marginVertical: inputGaps / 2,
  },
});
