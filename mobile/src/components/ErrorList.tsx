import React from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../util/useColorScheme";
import { RegularText } from "./StyledText";
import { View } from "./Themed";

const ErrorList: React.FC<{
  errors: { hasError: boolean; errorMessage: string }[];
}> = (props) => {
  const colorScheme = useColorScheme();
  const { errorColor } = Colors[colorScheme];
  return (
    <View
      style={{
        marginTop: 30,
        marginHorizontal: 10,
      }}
    >
      {props.errors.map((error, index) => {
        if (!error.hasError) {
          return;
        }
        return (
          <RegularText
            key={index}
            style={{
              color: errorColor,
              fontSize: 18,
            }}
          >
            &bull; {error.errorMessage}
          </RegularText>
        );
      })}
    </View>
  );
};

export default ErrorList;
