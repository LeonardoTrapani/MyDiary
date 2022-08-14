import { Roboto_100Thin, Roboto_300Light } from '@expo-google-fonts/roboto';
import React from 'react';
import {
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  KeyboardType,
  Image,
  Dimensions,
} from 'react-native';
import { AutoCapitalize, AutoComplete } from '../../types';
import useKeyboardOpened from '../util/useKeyboardOpened';
import MyInput from './MyInput';
import SolidButton from './SolidButton';
import { BoldText } from './StyledText';
import TextButton from './TextButton';

const AuthForm: React.FC<{
  title: string;
  insteadHandler: () => void;
  insteadTitle: string;
  inputs: AuthInputType[];
  submitHandler: () => void;
  svg: JSX.Element;
}> = (props) => {
  const isKeyboardOpened = useKeyboardOpened();
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.svgContainer}>{props.svg}</View>
        <View style={styles.body}>
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
            title={props.title}
            onPress={props.submitHandler}
            style={styles.submitButton}
          />
        </View>
        <TextButton
          title={props.insteadTitle}
          style={[styles.instead]}
          onPress={props.insteadHandler}
        />
      </View>
    </SafeAreaView>
  );
};

const inputGap = 15;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
  title: {
    fontSize: 50,
    marginBottom: 40,
  },
  svgContainer: {
    height: '40%',
  },
  body: {
    flex: 1,
  },
  instead: {
    alignSelf: 'center',
  },
  submitButton: {
    marginTop: 40,
  },
  applyGap: {
    marginVertical: inputGap / 2,
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
