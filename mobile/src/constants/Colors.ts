import { DefaultTheme, Theme, DarkTheme } from "@react-navigation/native";

const tintColorLight = "#3F68E0";
const opaqueColorLight = "#1841ba";
const tintColorDark = "#3F68E0";
const opaqueColorDark = "#1841ba";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    errorColor: "#E03F68",
    opaqueColor: opaqueColorLight,
    placeHolderColor: "#888",
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    errorColor: "#E03F68",
    placeHolderColor: "#ccc",
    opaqueColor: opaqueColorDark,
  },
};

export const MyLightTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
    primary: tintColorLight,
  },
};
export const MyDarkTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: tintColorDark,
  },
};
