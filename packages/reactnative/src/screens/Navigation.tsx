import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import ConfirmEmail from './Auth/common/ConfirmEmail';
import CreatePassword from './Auth/common/CreatePassword';
import CreateController from './Auth/creation/CreateController';
import CreateProfile from './Auth/creation/CreateProfile';
import DeployProfile from './Auth/creation/DeployProfile';
import Onboarding from './Auth/Onboarding';
import RecoverProfile from './Auth/recovery/RecoverProfile';
import SetupRecovery from './Auth/recovery/SetupRecovery';
import Dashboard from './Dashboard';
import EditProfile from './EditProfile';
import LSP7TokenDetails from './TokenDetails/LSP7TokenDetails';
import NetworkTokenDetails from './TokenDetails/NetworkTokenDetails';
import LSP7TokenTransfer from './Transfer/LSP7TokenTransfer';
import LSP8TokenTransfer from './Transfer/LSP8TokenTransfer';
import NetworkTokenTransfer from './Transfer/NetworkTokenTransfer';

type Props = {};

type AppStackParamsList = {
  Onboarding: undefined;
  CreatePassword: undefined;
  CreateController: undefined;
  CreateProfile: undefined;
  DeployProfile: {
    lsp3DataValue: {
      verification: {
        method: string;
        data: string;
      };
      url: string;
    };
  };
  SetupRecovery: undefined;
  ConfirmEmail: undefined;
  RecoverProfile: undefined;
  Dashboard: undefined;
  EditProfile: undefined;
  NetworkTokenTransfer: undefined;
  LSP7TokenTransfer: {
    tokenAddress: string;
    metadata: {
      name: string;
      symbol: string;
      image: string;
    };
  };
  LSP8TokenTransfer: {
    tokenAddress: string;
    metadata: {
      name: string;
      symbol: string;
      image: string;
      tokenId: any;
    };
  };
  NetworkTokenDetails: undefined;
  LSP7TokenDetails: {
    assetAddress: string;
  };
};

const AppStack = createNativeStackNavigator<AppStackParamsList>();

export default function Navigation({}: Props) {
  const auth = useSelector((state: any) => state.auth);
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        {!auth.isLoggedIn && (
          <>
            <AppStack.Screen name="Onboarding" component={Onboarding} />
            <AppStack.Screen name="CreatePassword" component={CreatePassword} />
            <AppStack.Screen
              name="CreateController"
              component={CreateController}
            />
            <AppStack.Screen name="CreateProfile" component={CreateProfile} />
            <AppStack.Screen name="DeployProfile" component={DeployProfile} />
            <AppStack.Screen name="SetupRecovery" component={SetupRecovery} />
            <AppStack.Screen name="ConfirmEmail" component={ConfirmEmail} />
            <AppStack.Screen name="RecoverProfile" component={RecoverProfile} />
          </>
        )}

        <AppStack.Screen name="Dashboard" component={Dashboard} />
        <AppStack.Screen name="EditProfile" component={EditProfile} />
        <AppStack.Screen
          name="NetworkTokenTransfer"
          component={NetworkTokenTransfer}
        />
        <AppStack.Screen
          name="LSP7TokenTransfer"
          component={LSP7TokenTransfer}
        />
        <AppStack.Screen
          name="LSP8TokenTransfer"
          component={LSP8TokenTransfer}
        />
        <AppStack.Screen
          name="NetworkTokenDetails"
          component={NetworkTokenDetails}
        />
        <AppStack.Screen name="LSP7TokenDetails" component={LSP7TokenDetails} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
