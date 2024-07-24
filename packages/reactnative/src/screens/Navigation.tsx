import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Onboarding from './Auth/Onboarding'
import CreatePassword from './Auth/common/CreatePassword'
import SelectProfile from './Auth/creation/SelectProfile'
import ReviewProfile from './Auth/creation/ReviewProfile'
import DeployProfile from './Auth/creation/DeployProfile'
import SelectRecoveryMethod from './Auth/recovery/SelectReoveryMethod';
import ConfirmEmail from './Auth/common/ConfirmEmail';
import RecoverProfile from './Auth/recovery/RecoverProfile';

type Props = {}

type AppStackParamsList = {
    Onboarding: undefined;
    CreatePassword: undefined;
    SelectProfile: undefined;
    ReviewProfile: undefined;
    DeployProfile: undefined;
    SelectRecoveryMethod: undefined;
    ConfirmEmail: undefined;
    RecoverProfile: undefined;
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
                            <AppStack.Screen name="SelectRecoveryMethod" component={SelectRecoveryMethod} />
                            <AppStack.Screen name="ConfirmEmail" component={ConfirmEmail} />
                            <AppStack.Screen name="RecoverProfile" component={RecoverProfile} />
                        </>
                    )
                }
            </AppStack.Navigator>
        </NavigationContainer>
    )
}