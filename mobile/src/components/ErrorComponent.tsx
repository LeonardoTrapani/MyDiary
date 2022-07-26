import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Colors from "../constants/Colors";

import globalStyles from "../constants/Syles";
import useColorScheme from "../util/useColorScheme";
import { MediumText } from "./StyledText";
import { View } from "./Themed";
const ErrorComponent: React.FC<{
  text: string | null;
  style?: StyleProp<ViewStyle>;
}> = (props) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={[
        styles.errorContainer,
        globalStyles.shadow,
        {
          backgroundColor: Colors[colorScheme].errorColor,
        },
        props.style,
      ]}
    >
      <MediumText style={[styles.errorText]}>{props.text}</MediumText>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 17,
    textAlign: "center",
    color: "#fff",
  },
  errorContainer: {
    marginBottom: 20,
    padding: 15,
  },
});

export default ErrorComponent;
