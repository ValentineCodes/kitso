import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import { COLORS } from '../../../../../utils/constants';
import { FONT_SIZE } from '../../../../../utils/styles';
import Tokens from './Tokens';

const Tab = createMaterialTopTabNavigator();

type Props = {}

export default function Assets({}: Props) {
  return (
    <Tab.Navigator screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
            backgroundColor: COLORS.primary,
        },
        tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: FONT_SIZE["lg"]
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#C7C6C7',
    }}>
        <Tab.Screen name="Tokens" component={Tokens} />
    </Tab.Navigator>
  )
}