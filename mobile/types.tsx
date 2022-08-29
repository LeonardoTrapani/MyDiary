/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
  Login: undefined;
  CreateWeek: undefined;
  Signup: undefined;
  AddHomework: NativeStackScreenProps<AddHomeworkStackParamList> | undefined;
};

export type AddHomeworkStackParamList = {
  Root: undefined;
  ChooseSubject: undefined;
  AddSubject: undefined;
  PlannedDates: HomeworkInfoType;
};

export type FreeDays = FreeDay[];

export type FreeDaysResponse = {
  nextCursor: number | undefined;
  page: {
    freeDays: FreeDays;
  };
};

export interface FreeDay {
  date: string;
  freeMins: number;
  minutesToAssign: number;
}

export interface HomeworkInfoType {
  title: string;
  description: string;
  subjectId: number;
  expirationDate: string;
  duration: number;
}

export type AddHomeworkStackScreenProps<
  Screen extends keyof AddHomeworkStackParamList
> = NativeStackScreenProps<AddHomeworkStackParamList, Screen>;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Homework: undefined;
  TabThree: undefined;
  Settings: undefined;
};
export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type AutoComplete =
  | "birthdate-day"
  | "birthdate-full"
  | "birthdate-month"
  | "birthdate-year"
  | "cc-csc"
  | "cc-exp"
  | "cc-exp-day"
  | "cc-exp-month"
  | "cc-exp-year"
  | "cc-number"
  | "email"
  | "gender"
  | "name"
  | "name-family"
  | "name-given"
  | "name-middle"
  | "name-middle-initial"
  | "name-prefix"
  | "name-suffix"
  | "password"
  | "password-new"
  | "postal-address"
  | "postal-address-country"
  | "postal-address-extended"
  | "postal-address-extended-postal-code"
  | "postal-address-locality"
  | "postal-address-region"
  | "postal-code"
  | "street-address"
  | "sms-otp"
  | "tel"
  | "tel-country-code"
  | "tel-national"
  | "tel-device"
  | "username"
  | "username-new"
  | "off"
  | undefined;

export type AutoCapitalize =
  | "none"
  | "sentences"
  | "words"
  | "characters"
  | undefined;
