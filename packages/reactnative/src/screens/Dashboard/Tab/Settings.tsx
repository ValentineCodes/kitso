import { ScrollView, View } from 'native-base';
import React from 'react';
import Account from '../../../components/cards/Account';
import styles from '../../../styles/global';

type Props = {};

export default function Settings({}: Props) {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 10 }}
      bgColor={'white'}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Account type="profile" />
        <View ml={'2'}>
          <Account type="controller" />
        </View>
        <View ml={'2'}>
          <Account type="keymanager" />
        </View>
      </ScrollView>
    </ScrollView>
  );
}
