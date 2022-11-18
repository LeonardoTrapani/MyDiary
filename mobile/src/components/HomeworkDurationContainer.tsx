import React from "react";
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

const HomeworkDurationContainer: React.FC<{
  title: string;
  style?: StyleProp<ViewStyle>;
  choosedValue: string;
  isValueChoosed: boolean;
  hasError: boolean;
  setOpened: () => void;
}> = (props) => {
  const pressHandler = () => {
    props.setOpened();
  };

  const cs = useColorScheme();
  const { errorColor, placeHolderColor } = Colors[cs];
  const { text } = useTheme().colors;

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
            props.isValueChoosed ? { color: text } : {},
          ]}
        >
          {props.isValueChoosed ? props.choosedValue : props.title}
        </RegularText>
        <Ionicons name="time-outline" size={24} color={placeHolderColor} />
      </TouchableOpacity>
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

export default HomeworkDurationContainer;
