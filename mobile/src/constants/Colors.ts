import { DefaultTheme, Theme, DarkTheme } from "@react-navigation/native";

const testColorTint = "#256D1B";
const testColorOpaque = "#244F26";

//const testColorTint = "#2d6a4f";
//const testColorOpaque = "#1b4332";

const tintColorLight = testColorTint;
const opaqueColorLight = testColorOpaque;
const tintColorDark = testColorTint;
const opaqueColorDark = testColorOpaque;

//const tintColorLight = "#3F68E0";
//const opaqueColorLight = "#1841ba";
//const tintColorDark = "#3F68E0";
//const opaqueColorDark = "#1841ba";

export default {
  light: {
    text: "#000",
    background: "#eee",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    errorColor: "#E03F68",
    opaqueColor: opaqueColorLight,
    placeHolderColor: "#ababab",
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#dddjk",
    tabIconSelected: tintColorDark,
    errorColor: "#E03F68",
    placeHolderColor: "#ddd",
    opaqueColor: opaqueColorDark,
  },
};

export const MyLightTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: "#f5f5f5",
    card: "#fff",
    primary: tintColorLight,
  },
};
export const MyDarkTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    card: "#000",
    primary: tintColorDark,
  },
};
