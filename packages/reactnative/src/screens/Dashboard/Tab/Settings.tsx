import { ScrollView } from 'native-base';
import React from 'react';
import AccountsList from './modules/settings/AccountsList';

type Props = {};

export default function Settings({}: Props) {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 10 }}
      bgColor={'white'}
    >
      <AccountsList />
    </ScrollView>
  );
}
