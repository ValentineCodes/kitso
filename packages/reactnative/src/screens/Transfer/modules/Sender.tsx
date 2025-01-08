import { HStack, Text, View, VStack } from 'native-base';
import React from 'react';
import Blockie from '../../../components/Blockie';
import useAccount from '../../../hooks/scaffold-eth/useAccount';
import { truncateAddress } from '../../../utils/helperFunctions';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  balance: string | null;
};

export default function Sender({ balance }: Props) {
  const account = useAccount();

  return (
    <VStack space="2">
      <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
        From:
      </Text>

      <View
        bgColor={'#f5f5f5'}
        flexDir="row"
        alignItems={'center'}
        justifyContent={'space-between'}
        borderRadius={10}
        padding={3}
      >
        <HStack alignItems="center" space="2">
          <Blockie address={account.address} size={1.8 * FONT_SIZE['xl']} />

          <VStack w="75%">
            <Text fontSize={FONT_SIZE['md']} fontWeight="medium">
              {truncateAddress(account.address)}
            </Text>
            <Text fontSize={FONT_SIZE['sm']}>
              Balance: {balance?.toString()}
            </Text>
          </VStack>
        </HStack>
      </View>
    </VStack>
  );
}
