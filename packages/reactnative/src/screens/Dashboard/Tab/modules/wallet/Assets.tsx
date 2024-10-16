import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import { FONT_SIZE } from '../../../../../utils/styles';

// screens
import Tokens from './Tokens';
import Collectibles from './Collectibles';

const Tab = createMaterialTopTabNavigator();

type Props = {}

export default function Assets({}: Props) {
  return (
    <Tab.Navigator screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
            backgroundColor: '#243542',
        },
        tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: FONT_SIZE["lg"]
        },
        tabBarActiveTintColor: '#243542',
        tabBarInactiveTintColor: 'gray',
    }}>
        <Tab.Screen name="Tokens" component={Tokens} />
        <Tab.Screen name="Collectibles" component={Collectibles} />
    </Tab.Navigator>
  )
}