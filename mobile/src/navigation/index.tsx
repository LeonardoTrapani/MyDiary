import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { Text } from 'react-native';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import { RootStackParamList, RootTabParamList } from '../../types';
import LinkingConfiguration from './LinkingConfiguration';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';

import useInitialLoading from '../util/useInitialLoading';
import { useIsWeekCreated, useValidToken } from '../util/react-query-hooks';
import { MyDarkTheme, MyLightTheme } from '../constants/Colors';
import CreateWeekScreen from '../screens/CreateWeekScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeworkScreen from '../screens/HomeworkScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import AddHomeworkModal from '../screens/AddHomeworkModal';

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
            theme={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}
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

    if (!validToken || (isWeekLoading && !isWeekCreated)) {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Signup'
                    component={SignupScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='NotFound'
                    component={NotFoundScreen}
                    options={{ title: 'Oops!' }}
                />
            </Stack.Navigator>
        );
    }
    if (validToken && !isWeekCreated) {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name='CreateWeek'
                    component={CreateWeekScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='NotFound'
                    component={NotFoundScreen}
                    options={{ title: 'Oops!' }}
                />
            </Stack.Navigator>
        );
    }

    if (validToken && isWeekCreated) {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name='Root'
                    component={BottomTabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='NotFound'
                    component={NotFoundScreen}
                    options={{ title: 'Oops!' }}
                />
                <Stack.Group screenOptions={{ presentation: 'modal' }}>
                    <Stack.Screen name='AddHomework' component={AddHomeworkModal} />
                </Stack.Group>
            </Stack.Navigator>
        );
    }
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='NotFound'
                component={NotFoundScreen}
                options={{ title: 'Oops!' }}
            />
        </Stack.Navigator>
    );
};

const BottomTabNavigator = () => {
    return (
        <BottomTab.Navigator initialRouteName='Home'>
            <BottomTab.Screen
                name='Home'
                component={HomeScreen}
                options={() => ({
                    title: 'Logo',
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name='home' size={size} color={color} />;
                    },
                    tabBarShowLabel: false,
                })}
            />
            <BottomTab.Screen
                name='Homework'
                component={HomeworkScreen}
                options={{
                    title: 'Homework',
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name='book' size={size} color={color} />;
                    },
                    tabBarShowLabel: false,
                }}
            />
            <BottomTab.Screen
                name='TabThree'
                component={TabOneScreen}
                options={{
                    title: 'TabThree',
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <Ionicons name='stats-chart-sharp' size={size} color={color} />
                        );
                    },
                    tabBarShowLabel: false,
                }}
            />
            <BottomTab.Screen
                name='Settings'
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name='settings' size={size} color={color} />;
                    },
                    tabBarShowLabel: false,
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
