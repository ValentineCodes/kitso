import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import { FONT_SIZE } from '../../../../../utils/styles';

// screens
import Tokens from './Tokens';
import Collectibles from './Collectibles';
import { View } from 'native-base';

const Tab = createMaterialTopTabNavigator();

const PRIMARY_COLOR = '#243542'
type Props = {}

export default function Assets({}: Props) {
  return (
    <View flex={1} bgColor="#F9FAFB">
      <Tab.Navigator screenOptions={{
          tabBarLabelStyle: {
              textTransform: 'none',
              fontSize: FONT_SIZE["lg"],
              fontWeight: "bold"
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
            elevation: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: PRIMARY_COLOR,
          }
      }}>
          <Tab.Screen name="Tokens" component={Tokens} />
          <Tab.Screen name="Collectibles" component={Collectibles} />
      </Tab.Navigator>
    </View>
  )
}