import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import { Text } from "react-native";
import NotFoundScreen, { NoConnectionScreen } from "../screens/NotFoundScreen";
import HomeScreen from "../screens/HomeScreen";
import {
  AddGradeStackParamList,
  AddHomeworkStackParamList,
  GradeStackParamList,
  HomeScreenStackParamList as HomeStackParamList,
  PlannedHomeworkStackParamList,
  RootStackParamList,
  RootTabParamList,
} from "../../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { LoginScreen } from "../screens/LoginScreen";
import { SignupScreen } from "../screens/SignupScreen";

import useInitialLoading from "../util/useInitialLoading";
import {
  useIsWeekCreated,
  useValidConnection,
  useValidToken,
} from "../util/react-query-hooks";
import { MyDarkTheme, MyLightTheme } from "../constants/Colors";
import CreateWeekScreen from "../screens/CreateWeekScreen";
import PlannedHomeworkScreen, {
  AddHomeworkIcon,
  CalendarDayInfoIcon,
  DayInfoModal,
} from "../screens/PlannedHomeworkScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import AddHomeworkModal from "../screens/AddHomeworkModal";
import ChooseSubjectScreen, {
  AddSubjectScreen,
  ChooseSubjectAddIcon,
} from "../screens/ChooseSubjectScreen";
import { useAtom } from "jotai";
import { activeSubjectAtom } from "../util/atoms";
import PlannedDatesScreen, {
  PlannedDatesInfoIcon,
} from "../screens/PlannedDatesScreen";
import SingleHomeworkScreen from "../screens/SingleHomeworkScreen";
import GradeScreen, {
  AddGradeIcon,
  SingleSubjectGradeScreen,
} from "../screens/GradeScreen";
import AddGradeModal from "../screens/AddGradeModal";

export default function Main({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const isLoadingComplete = useInitialLoading();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}
      fallback={<Text>Splash screen...</Text>}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return <NavigatorBody />;
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

const NavigatorBody: React.FC = () => {
  const { data: validToken } = useValidToken();
  const { data: isWeekCreated, isLoading: isWeekLoading } = useIsWeekCreated();
  const setActiveSubject = useAtom(activeSubjectAtom)[1];
  const { data: isValidConnection } = useValidConnection();

  if (isValidConnection === false) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="NoConnection"
          component={NoConnectionScreen}
          options={{ title: "Oops!" }}
        />
      </Stack.Navigator>
    );
  }

  if (!validToken || (isWeekLoading && !isWeekCreated)) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
      </Stack.Navigator>
    );
  }
  if (validToken && !isWeekCreated) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="CreateWeek"
          component={CreateWeekScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
      </Stack.Navigator>
    );
  }

  if (validToken && isWeekCreated) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
        <Stack.Screen
          name="AddHomework"
          listeners={{
            beforeRemove: () => {
              setActiveSubject(null);
            },
          }}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
          component={AddHomeworkModalNavigation}
        />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
};

const AddHomeworkStack =
  createNativeStackNavigator<AddHomeworkStackParamList>();

const AddHomeworkModalNavigation = () => {
  return (
    <AddHomeworkStack.Navigator
      screenOptions={{ headerBackTitleVisible: false }}
    >
      <AddHomeworkStack.Screen
        name="Root"
        component={AddHomeworkModal}
        options={{
          title: "New Homework",
          presentation: "modal",
        }}
      />
      <AddHomeworkStack.Screen
        name="ChooseSubject"
        component={ChooseSubjectScreen}
        options={{
          title: "Subject",
          presentation: "card",
          headerBackTitle: "Homework",
          headerRight: ChooseSubjectAddIcon,
        }}
      />
      <AddHomeworkStack.Screen
        name="AddSubject"
        component={AddSubjectScreen}
        options={{
          title: "New Subject",
          presentation: "card",
          headerBackTitle: "Subject",
        }}
      />
      <AddHomeworkStack.Screen
        name="PlannedDates"
        component={PlannedDatesScreen}
        options={{
          title: "",
          presentation: "card",
          headerRight: PlannedDatesInfoIcon,
          headerShadowVisible: false,
          headerBackTitle: "homework",
        }}
      />
      <AddHomeworkStack.Screen
        name="info"
        component={DayInfoModal}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </AddHomeworkStack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="PlannedHomework"
      screenOptions={{ tabBarShowLabel: false }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStackNavigation}
        options={{
          title: "[ LOGO ]",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="book" size={size} color={color} />;
          },
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="PlannedHomework"
        component={PlannedHomeworkStackNavigation}
        options={() => ({
          title: "[ LOGO ]",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="calendar" size={size} color={color} />;
          },
          headerShown: false,
        })}
      />
      <BottomTab.Screen
        name="Grades"
        component={GradeStackNavigation}
        options={() => ({
          title: "Grades",
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name="stats-chart-sharp" size={size} color={color} />
            );
          },
        })}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="settings" size={size} color={color} />;
          },
          tabBarShowLabel: false,
        }}
      />
    </BottomTab.Navigator>
  );
};

const HomeStackNavigation = () => {
  return (
    <HomeStack.Navigator initialRouteName="Root">
      <HomeStack.Screen
        name="Root"
        component={HomeScreen}
        options={{
          title: "LOGO",
          headerRight: AddHomeworkIcon,
        }}
      />
      <HomeStack.Screen
        name="SingleHomework"
        component={SingleHomeworkScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitleVisible: false,
        })}
      />
    </HomeStack.Navigator>
  );
};

const PlannedHomeworkStackNavigation = () => {
  return (
    <PlannedHomeworkStack.Navigator initialRouteName="Root">
      <PlannedHomeworkStack.Screen
        name="Root"
        component={PlannedHomeworkScreen}
        options={{
          title: "LOGO",
          headerRight: AddHomeworkIcon,
          headerLeft: CalendarDayInfoIcon,
        }}
      />
      <PlannedHomeworkStack.Screen
        name="SingleHomework"
        component={SingleHomeworkScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitleVisible: false,
        })}
      />
      <PlannedHomeworkStack.Screen
        name="Info"
        component={DayInfoModal}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </PlannedHomeworkStack.Navigator>
  );
};

const GradeStackNavigation = () => {
  const setActiveSubject = useAtom(activeSubjectAtom)[1];

  return (
    <GradeStack.Navigator initialRouteName="Root">
      <GradeStack.Screen
        name="Root"
        options={{
          title: "Grades",
          headerRight: AddGradeIcon,
        }}
        component={GradeScreen}
      ></GradeStack.Screen>
      <GradeStack.Screen
        name="Add"
        options={{
          title: "New Grade",
          headerShown: false,
          presentation: "modal",
        }}
        listeners={{
          beforeRemove: () => {
            setActiveSubject(null);
          },
        }}
        component={AddGradeStackNavigation}
      ></GradeStack.Screen>
      <GradeStack.Screen
        name="SubjectGrades"
        options={({ route }) => ({
          presentation: "card",
          title: route.params.name,
          headerShown: true,
        })}
        listeners={{
          beforeRemove: () => {
            setActiveSubject(null);
          },
        }}
        component={SingleSubjectGradeScreen}
      ></GradeStack.Screen>
    </GradeStack.Navigator>
  );
};

const AddGradeStackNavigation = () => {
  return (
    <AddGradeStack.Navigator
      screenOptions={{ headerShown: true, headerTitle: "New Grade" }}
      initialRouteName="Root"
    >
      <AddGradeStack.Screen name="Root" component={AddGradeModal} />
      <AddGradeStack.Screen
        name="ChooseSubject"
        options={{
          presentation: "card",
          headerTitle: "New Grade",
          headerRight: ChooseSubjectAddIcon,
        }}
        component={ChooseSubjectScreen}
      />
      <AddGradeStack.Screen
        name="AddSubject"
        component={AddSubjectScreen}
        options={{
          title: "New Subject",
          presentation: "card",
          headerBackTitle: "Subject",
        }}
      />
    </AddGradeStack.Navigator>
  );
};

const GradeStack = createNativeStackNavigator<GradeStackParamList>();
const AddGradeStack = createNativeStackNavigator<AddGradeStackParamList>();
const PlannedHomeworkStack =
  createNativeStackNavigator<PlannedHomeworkStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
