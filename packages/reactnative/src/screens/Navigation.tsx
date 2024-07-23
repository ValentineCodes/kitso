import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Onboarding from './Auth/Onboarding'
import CreateUsername from './Auth/CreateUsername'
import CreatePassword from './Auth/CreatePassword'

type Props = {}

type AppStackParamsList = {
    Onboarding: undefined;
    CreateUsername: undefined;
    CreatePassword: undefined
}

const AppStack = createNativeStackNavigator<AppStackParamsList>();

export default function Navigation({ }: Props) {
    const auth = useSelector((state: any) => state.auth)
    return (
        <NavigationContainer>
            <AppStack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}>
                {
                    !auth.isLoggedIn && (
                        <>
                            <AppStack.Screen name="Onboarding" component={Onboarding} />
                            <AppStack.Screen name="CreateUsername" component={CreateUsername} />
                            <AppStack.Screen name="CreatePassword" component={CreatePassword} />
                        </>
                    )
                }
            </AppStack.Navigator>
        </NavigationContainer>
    )
}