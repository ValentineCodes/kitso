import { Text } from 'native-base';
import React from 'react';
import { TextStyle } from 'react-native';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import { parseBalance } from '../../utils/helperFunctions';

type Props = {
  address: string;
  style?: TextStyle;
};

export default function Balance({ address, style }: Props) {
  const { balance, isLoading } = useBalance({ address });

  if (isLoading) return;

  return (
    <Text fontSize={'md'} fontWeight={'medium'} style={style}>
      {balance !== null ? `${parseBalance(balance)} ` : null}
    </Text>
  );
}
