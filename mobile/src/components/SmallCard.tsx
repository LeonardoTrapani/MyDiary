import React from "react";
import { TouchableOpacity } from "react-native";
import { CardView } from "./Themed";

const SmallCard: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
}> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={{ marginHorizontal: 15 }}>
      <CardView
        style={[
          {
            flexDirection: "row",
            padding: 12,
          },
          props.isFirst
            ? {
                marginTop: 15,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }
            : {},
          props.isLast
            ? {
                marginBottom: 15,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
              }
            : {},
        ]}
      >
        {props.children}
      </CardView>
      {!props.isLast && (
        <CardView>
          <CardView
            style={{
              height: 0.7,
              backgroundColor: "#ddd",
              flex: 1,
              marginLeft: 40,
            }}
          ></CardView>
        </CardView>
      )}
    </TouchableOpacity>
  );
};
export default SmallCard;
