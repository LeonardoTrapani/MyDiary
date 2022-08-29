import React, { useMemo } from "react";
import { StyleProp, TextStyle } from "react-native";
import { MediumText } from "./StyledText";

const MinutesToHoursMinutes: React.FC<{
  minutes: number;
  style?: StyleProp<TextStyle>;
}> = (props) => {
  const h = useMemo(() => Math.floor(props.minutes / 60), [props.minutes]);
  const m = useMemo(() => props.minutes % 60, [props.minutes]);

  return (
    <MediumText style={props.style}>
      {h}h {m}m
    </MediumText>
  );
};

export default MinutesToHoursMinutes;
