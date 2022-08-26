import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { RegularText } from "./StyledText";
import { View } from "./Themed";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Colors from "../constants/Colors";
import useColorScheme from "../util/useColorScheme";

const Accordion: React.FC<{
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  choosedValue: string;
  isValueChoosed: boolean;
  hasError: boolean;
}> = (props) => {
  const [isOpened, setIsOpened] = useState(false);

  const pressHandler = () => {
    setIsOpened((prev) => !prev);
  };
  const cs = useColorScheme();
  const { errorColor } = Colors[cs];
  const { card, text } = useTheme().colors;

  return (
    <View
      style={[
        styles.container,
        props.style,
        {
          backgroundColor: "#fff",
        },
      ]}
    >
      <TouchableOpacity
        onPress={pressHandler}
        style={[
          styles.main,
          isOpened
            ? {}
            : {
                borderBottomWidth: 1,
                borderColor: "#0000001e",
              },
        ]}
      >
        <RegularText
          style={[
            styles.text,
            !isOpened && props.isValueChoosed ? { color: text } : {},
            props.hasError ? { color: errorColor } : {},
          ]}
        >
          {!isOpened && props.isValueChoosed ? props.choosedValue : props.title}
        </RegularText>
        <Ionicons
          name="chevron-down"
          size={24}
          color="#aaa"
          style={{
            transform: [{ rotate: !isOpened ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>
      {isOpened && (
        <View
          style={[
            styles.children,
            {
              backgroundColor: card,
            },
          ]}
        >
          {props.children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    justifyContent: "center",
    fontSize: 17,
  },
  main: {
    height: 55,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    flexDirection: "row",
    fontSize: 17,
  },
  text: {
    fontSize: 17,
    color: "#888",
  },
  children: {
    borderBottomWidth: 1,
    borderColor: "#0000001e",
  },
});

export default Accordion;
