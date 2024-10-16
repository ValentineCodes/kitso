import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import Home from './Tab/Home';
import DebugContracts from './Tab/DebugContracts';
import Wallet from './Tab/Wallet';
import Settings from './Tab/Settings';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/styles';
import { COLORS } from '../../utils/constants';

const Tab = createBottomTabNavigator();

type Props = {};

const renderTabIcon = (focused: boolean, name: string) => (
  <Ionicons
    name={focused ? name : `${name}-outline`}
    color={focused ? COLORS.primary : 'grey'}
    size={WINDOW_WIDTH * 0.06}
  />
);

export default function Dashboard({ }: Props) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          paddingBottom: 0,
          height: WINDOW_HEIGHT * 0.07,
        },
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarItemStyle: { marginVertical: 5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'home'),
        }}
      />
      <Tab.Screen
        name="DebugContracts"
        component={DebugContracts}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'bug'),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'wallet'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'settings'),
        }}
      />
    </Tab.Navigator>
  );
}
