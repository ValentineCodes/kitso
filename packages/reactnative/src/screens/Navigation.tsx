import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Onboarding from './Auth/Onboarding'
import CreatePassword from './Auth/common/CreatePassword'
import SelectProfile from './Auth/creation/SelectProfile'
import ReviewProfile from './Auth/creation/ReviewProfile'
import DeployProfile from './Auth/creation/DeployProfile'
import SetupRecovery from './Auth/recovery/SetupRecovery';
import ConfirmEmail from './Auth/common/ConfirmEmail';
import RecoverProfile from './Auth/recovery/RecoverProfile';

import Dashboard from './Dashboard';

type Props = {}

type AppStackParamsList = {
    Onboarding: undefined;
    CreatePassword: undefined;
    SelectProfile: undefined;
    ReviewProfile: undefined;
    DeployProfile: undefined;
    SetupRecovery: undefined;
    ConfirmEmail: undefined;
    RecoverProfile: undefined;
    Dashboard: undefined;
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
                            <AppStack.Screen name="CreatePassword" component={CreatePassword} />
                            <AppStack.Screen name="SelectProfile" component={SelectProfile} />
                            <AppStack.Screen name="ReviewProfile" component={ReviewProfile} />
                            <AppStack.Screen name="DeployProfile" component={DeployProfile} />
                            <AppStack.Screen name="SetupRecovery" component={SetupRecovery} />
                            <AppStack.Screen name="ConfirmEmail" component={ConfirmEmail} />
                            <AppStack.Screen name="RecoverProfile" component={RecoverProfile} />
                        </>
                    )
                }

                <AppStack.Screen name="Dashboard" component={Dashboard} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}