import React from "react";
import { View } from "./Themed";

const Break: React.FC = () => {
  return (
    <View
      style={{
        height: 0.5,
        opacity: 0.6,
        backgroundColor: "#bbb",
      }}
    />
  );
};

export default Break;
