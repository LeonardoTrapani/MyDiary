import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

const KeyboardWrapper: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <KeyboardAvoidingView behavior="padding">
      <SafeAreaView>
        <ScrollView
          scrollEnabled={false}
          style={[{ height: "100%" }]}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            {props.children}
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardWrapper;
