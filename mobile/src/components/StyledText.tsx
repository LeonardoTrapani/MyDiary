import { Text, TextProps } from "./Themed";
import React from "react";
import { useTheme } from "@react-navigation/native";

interface CustomTextProps extends TextProps {
  fontFam: string;
}

export const RegularText: React.FC<TextProps> = (props) => {
  return <CustomText adjustsFontSizeToFit {...props} fontFam={"regular"} />;
};

export const MediumText: React.FC<TextProps> = (props) => {
  return <CustomText adjustsFontSizeToFit {...props} fontFam={"medium"} />;
};

export const BoldText: React.FC<TextProps> = (props) => {
  return <CustomText adjustsFontSizeToFit {...props} fontFam={"bold"} />;
};

export const ItalicText: React.FC<TextProps> = (props) => {
  return <CustomText adjustsFontSizeToFit {...props} fontFam={"italic"} />;
};

const CustomText: React.FC<CustomTextProps> = (props) => {
  const { text } = useTheme().colors;

  return (
    <Text
      {...props}
      style={[{ fontFamily: props.fontFam, color: text }, props.style]}
    />
  );
};
