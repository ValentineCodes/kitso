import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import { Text, View } from 'native-base';
import React from 'react';
import { getAllContracts } from './../../../../utils/scaffold-eth/contractsData';
import { COLORS } from './../../../utils/constants';
import { FONT_SIZE } from './../../../utils/styles';
import ContractUI from './modules/debugContracts/contract/ContractUI';

const Tab = createMaterialTopTabNavigator();

const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData);

type Props = {};

export default function DebugContracts({}: Props) {
  const isFocused = useIsFocused();

  if (!isFocused) return null;

  return (
    <View flex={1} bgColor="white">
      {contractNames.length === 0 ? (
        <View flex={1} alignItems="center" justifyContent="center">
          <Text fontSize="xl">No contracts found!</Text>
        </View>
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarIndicatorStyle: {
              backgroundColor: COLORS.primary
            },
            tabBarLabelStyle: {
              textTransform: 'none',
              fontSize: FONT_SIZE.lg
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: '#C7C6C7'
          }}
        >
          {contractNames.map(contractName => (
            <Tab.Screen
              key={contractName}
              name={contractName}
              component={ContractUI}
            />
          ))}
        </Tab.Navigator>
      )}
    </View>
  );
}
