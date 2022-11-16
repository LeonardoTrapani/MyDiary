import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Break from "./Break";
import { RegularText } from "./StyledText";

const TextWithDividers: React.FC<{
  children: string;
  style?: StyleProp<ViewStyle>;
}> = (props) => {
  return (
    <View
      style={[
        {
          alignItems: "center",
          flexDirection: "row",
        },
        props.style,
      ]}
    >
      <View style={{ flexGrow: 1 }}>
        <Break />
      </View>
      <RegularText
        style={{
          paddingHorizontal: 20,
          color: "#999",
        }}
      >
        {props.children}
      </RegularText>
      <View style={{ flexGrow: 1 }}>
        <Break />
      </View>
    </View>
  );
};

export default TextWithDividers;
