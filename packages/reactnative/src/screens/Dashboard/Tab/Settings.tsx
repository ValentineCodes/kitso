import { HStack, ScrollView, Switch, Text, VStack } from 'native-base';
import React from 'react';
import { useDispatch } from 'react-redux';
import useSettings from '../../../hooks/useSettings';
import { toggleAutoSign } from '../../../store/reducers/Settings';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';
import AccountsList from './modules/settings/AccountsList';

type Props = {};

export default function Settings({}: Props) {
  const settings = useSettings();
  const dispatch = useDispatch();

  const handleAutoSign = () => {
    dispatch(toggleAutoSign());
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 10 }}
      bgColor={'white'}
    >
      <AccountsList />

      <HStack
        alignItems="center"
        justifyContent="space-between"
        mt={4}
        w={'full'}
      >
        <VStack w={'70%'}>
          <Text fontSize={FONT_SIZE['lg']}>Auto-Sign</Text>
          <Text fontSize={FONT_SIZE['sm']}>
            You won't be able to see transaction costs
          </Text>
        </VStack>

        <Switch
          size="md"
          trackColor={{ true: COLORS.primary, false: '#E5E5E5' }}
          isChecked={settings.autoSign}
          onToggle={handleAutoSign}
        />
      </HStack>
    </ScrollView>
  );
}
