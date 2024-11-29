import { ScrollView, View } from 'native-base';
import React from 'react';
import Account from '../../../../../components/cards/Account';

type Props = {};

export default function AccountsList({}: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Account type="profile" />
      <View ml={'2'}>
        <Account type="controller" />
      </View>
      <View ml={'2'}>
        <Account type="keymanager" />
      </View>
    </ScrollView>
  );
}
