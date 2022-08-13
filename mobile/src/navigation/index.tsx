import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { Text } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../util/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList } from '../../types';
import LinkingConfiguration from './LinkingConfiguration';
import { Login, Signup } from '../screens/Auth';

import useInitialLoading from '../util/useInitialLoading';
import { useUserId } from '../util/react-query-hooks';

export default function Main({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const isLoadingComplete = useInitialLoading();
  if (!isLoadingComplete) {
    //SPLASH SCREEN
    return null;
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      fallback={<Text>Splash screen...</Text>}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { data: userId } = useUserId();
  return (
    <Stack.Navigator>
      {userId ? (
        <Stack.Screen
          name='Root'
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Signup'
            component={Signup}
            options={{ headerShown: false }}
          />
        </>
      )}

      <Stack.Screen
        name='NotFound'
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName='TabOne'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name='TabOne'
        component={TabOneScreen}
        options={() => ({
          title: 'Tab One',
          // tabBarIcon: ({ color }) => <TabBarIcon name='code' color={color} />,
        })}
      />
      <BottomTab.Screen
        name='TabTwo'
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          // tabBarIcon: ({ color }) => <TabBarIcon name='code' color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
};

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
// }
