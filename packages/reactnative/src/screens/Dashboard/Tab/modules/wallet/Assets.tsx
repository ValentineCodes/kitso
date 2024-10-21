import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'native-base';
import React from 'react';
import { COLORS } from '../../../../../utils/constants';
import { FONT_SIZE } from '../../../../../utils/styles';
import Collectibles from './Collectibles';
// screens
import Tokens from './Tokens';

const Tab = createMaterialTopTabNavigator();

const PRIMARY_COLOR = '#243542';
type Props = {};

export default function Assets({}: Props) {
  return (
    <View flex={1} bgColor={COLORS.background}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: FONT_SIZE['lg'],
            fontWeight: 'bold'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
          tabBarInactiveTintColor: '#999',

          tabBarStyle: {
            backgroundColor: 'transparent',
            position: 'absolute',
            left: 75,
            right: 75,
            top: 5,
            height: 50,
            width: 'auto',
            elevation: 0
          },
          tabBarIndicatorStyle: {
            backgroundColor: PRIMARY_COLOR
          }
        }}
      >
        <Tab.Screen name="Tokens" component={Tokens} />
        <Tab.Screen name="Collectibles" component={Collectibles} />
      </Tab.Navigator>
    </View>
  );
}
