/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "Home",
            },
          },

          Home: {
            screens: {
              HomeworkScreen: "Homework",
            },
          },
          TabThree: {
            screens: {
              TabThreeScreen: "three",
            },
          },
          Settings: {
            screens: {
              SettingsSCreen: "settings",
            },
          },
        },
      },
      Login: "login",
      Signup: "Signup",
      CreateWeek: "CreateWeek",
      NotFound: "*",
      AddHomework: {},
    },
  },
};

export default linking;
