import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import { Text } from "react-native";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import {
  AddHomeworkStackParamList,
  HomeworkStackParamList,
  RootStackParamList,
  RootTabParamList,
} from "../../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { LoginScreen } from "../screens/LoginScreen";
import { SignupScreen } from "../screens/SignupScreen";

import useInitialLoading from "../util/useInitialLoading";
import { useIsWeekCreated, useValidToken } from "../util/react-query-hooks";
import { MyDarkTheme, MyLightTheme } from "../constants/Colors";
import CreateWeekScreen from "../screens/CreateWeekScreen";
import HomeworkScreen from "../screens/HomeworkScreen";
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
import EditScreen from "../screens/EditScreen";

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
    </AddHomeworkStack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator initialRouteName="Homework">
      <BottomTab.Screen
        name="Homework"
        component={HomeworkStackNavigation}
        options={() => ({
          title: "Logo",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="home" size={size} color={color} />;
          },
          headerShown: false,
        })}
      />
      <BottomTab.Screen
        name="TabThree"
        component={TabOneScreen}
        options={{
          title: "TabThree",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name="stats-chart-sharp" size={size} color={color} />
            );
          },
          tabBarShowLabel: false,
        }}
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

const HomeworkStackNavigation = () => {
  return (
    <HomeworkStack.Navigator initialRouteName="Root">
      <HomeworkStack.Screen
        name="Root"
        component={HomeworkScreen}
        options={{
          title: "LOGO",
        }}
      />
      <HomeworkStack.Screen
        name="Edit"
        component={EditScreen}
        options={{
          presentation: "card",
          title: "Edit Day",
          headerBackTitleVisible: false,
        }}
      />
    </HomeworkStack.Navigator>
  );
};

const HomeworkStack = createNativeStackNavigator<HomeworkStackParamList>();
