import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { CardView } from "./Themed";

const ListCardComponent: React.FC<{
  index: number;
  rightArrow?: boolean;
  children: React.ReactNode;
  onPress?: (i: number) => void;
  style?: StyleProp<ViewStyle>;
}> = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!props.onPress) {
          return;
        }
        props.onPress(props.index);
      }}
    >
      <CardView
        style={[
          {
            padding: 9,
            borderWidth: 0.8,
            borderTopWidth: props.index === 0 ? 0.8 : 0,
            borderColor: "#bbb",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
          props.style,
        ]}
      >
        {props.children}
        {props.rightArrow ? (
          <Ionicons name="ios-chevron-forward" size={25} />
        ) : (
          <></>
        )}
      </CardView>
    </TouchableOpacity>
  );
};

export default ListCardComponent;
