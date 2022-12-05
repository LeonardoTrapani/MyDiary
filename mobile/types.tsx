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

export type SingleHomeworkType = {
  name: string;
  duration: number | null;
  description: string;
  expirationDate: string;
  subject: {
    name: string;
    id: number;
    color: string;
  };
  plannedDates: {
    completed: boolean;
    id: number;
    date: string;
    minutesAssigned: number;
  }[];
  timeToComplete: number | null;
  completed: boolean;
  id: number;
};

export type AllGrades = {
  averageGrade: number | null;
  id: number;
  subjects: {
    averageGrade: number | null;
    id: number;
    color: string;
    name: string;
    grades: {
      grade: number;
    }[];
  }[];
};

export type DueHomeworkType = {
  userId: number;
  name: string;
  id: number;
  completed: boolean;
  subject: {
    name: string;
    color: string;
  };
  description: string;
  expirationDate: Date;
  duration: number | null;
};

export type PlannedCalendarDayType = {
  date: string;
  user: {
    homework: {
      completed: boolean;
      id: number;
      name: string;
      timeToComplete: number;
      subject: {
        id: number;
        name: string;
        color: string;
      };
      plannedDates: {
        date: string;
        id: number;
        minutesAssigned: number;
        completed: boolean;
      }[];
      description: string;
      expirationDate: string;
      duration: number;
    }[];
  };
  freeMins: number;
  minutesToAssign: number;
} | null;

export type DueCalendarDayType = {
  homeworkList: {
    userId: number;
    completed: boolean;
    name: string;
    id: number;
    subject: {
      name: string;
      color: string;
    };
    description: string;
    expirationDate: Date;
    duration: number | null;
  }[];
  date: string;
};

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
  NoConnection: undefined;
  Login: undefined;
  CreateWeek: undefined;
  Signup: undefined;
  AddHomework: NativeStackScreenProps<AddHomeworkStackParamList> | undefined;
};

export type AddHomeworkStackParamList = {
  Root: undefined;
  ChooseSubject: undefined;
  AddSubject: undefined;
  Duration: plannedDatesPropsType;
  PlannedDates: plannedDatesPropsType;
  info: undefined;
};

export type SelectedDay = {
  date: string;
  minutes: number;
};

export type FreeDaysType = FreeDayType[];

export type FreeDaysResponse = {
  nextCursor: number | undefined;
  page: {
    freeDays: FreeDaysType;
  };
};

export interface FreeDayType {
  date: string;
  freeMins: number;
  minutesToAssign: number;
}

export interface HomeworkInfoType {
  title: string;
  description: string;
  subjectId: number;
  expirationDate: string;
  duration?: number;
}

export interface HomeworkPlanInfoType {
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
  Home: NativeStackScreenProps<HomeStackParamList> | undefined;
  PlannedHomework:
    | NativeStackScreenProps<PlannedHomeworkStackParamList>
    | undefined;
  Grades: NativeStackScreenProps<GradeStackParamList> | undefined;
  Settings: undefined;
};

export type PlannedHomeworkScreenProps<
  Screen extends keyof PlannedHomeworkStackParamList
> = NativeStackScreenProps<PlannedHomeworkStackParamList, Screen>;

type plannedDatesPropsType = {
  homeworkPlanInfo: HomeworkPlanInfoType;
  previousPlannedDates?: {
    completed: boolean;
    id: number;
    date: string;
    minutesAssigned: number;
  }[];
  homeworkId?: number;
  isEditing: boolean;
};
export type PlannedHomeworkStackParamList = {
  SingleHomework: { homeworkId: number; title: string };
  PlannedDates: plannedDatesPropsType;
  Duration: plannedDatesPropsType;
  Root: undefined | { date: string };
  Info: undefined;
};

export type HomeScreenProps<Screen extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, Screen>;

export type HomeStackParamList = {
  SingleHomework: { homeworkId: number; title: string };
  Root: undefined | { date: string };
  Duration: plannedDatesPropsType;
  PlannedDates: plannedDatesPropsType;
  info: undefined;
};

export type GradeStackScreenProps<Screen extends keyof GradeStackParamList> =
  NativeStackScreenProps<GradeStackParamList, Screen>;

export type GradeStackParamList = {
  Root: undefined;
  Add: NativeStackScreenProps<AddGradeStackParamList>;
  SubjectGrades: {
    averageGrade: number | null;
    id: number;
    color: string;
    name: string;
    grades: {
      grade: number;
    }[];
  };
};
export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type AddGradeStackParamList = {
  Root: undefined;
  ChooseSubject: undefined;
  AddSubject: undefined;
};

export type AddGradeStackScreenProps<
  Screen extends keyof AddGradeStackParamList
> = NativeStackScreenProps<AddGradeStackParamList, Screen>;

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
