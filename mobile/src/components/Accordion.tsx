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
  const { errorColor, placeHolderColor } = Colors[cs];
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
      <TouchableOpacity onPress={pressHandler} style={[styles.main]}>
        <RegularText
          style={[
            styles.text,
            props.hasError
              ? { color: errorColor }
              : { color: placeHolderColor },
            !isOpened && props.isValueChoosed ? { color: text } : {},
          ]}
        >
          {!isOpened && props.isValueChoosed ? props.choosedValue : props.title}
        </RegularText>
        <Ionicons
          name="chevron-down"
          size={24}
          color={placeHolderColor}
          style={{
            transform: [{ rotate: !isOpened ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>
      {isOpened && (
        <View
          style={[
            {
              backgroundColor: card,
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
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
    justifyContent: "center",
    borderRadius: 8,
    fontSize: 17,
  },
  main: {
    height: 47,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    flexDirection: "row",
    fontSize: 17,
  },
  text: {
    fontSize: 17,
  },
});

export default Accordion;
