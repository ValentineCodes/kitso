import { useNavigation } from '@react-navigation/native';
import { HStack, Image, Pressable, Text, View, VStack } from 'native-base';
import React, { useEffect } from 'react';
import useAccount from '../../../hooks/scaffold-eth/useAccount';
import useBalance from '../../../hooks/scaffold-eth/useBalance';
import { useCryptoPrice } from '../../../hooks/scaffold-eth/useCryptoPrice';
import useNetwork from '../../../hooks/scaffold-eth/useNetwork';
import { WINDOW_WIDTH } from '../../../utils/styles';

type Props = {};

export default function NetworkToken({}: Props) {
  const navigation = useNavigation();
  const network = useNetwork();
  const account = useAccount();
  const { balance } = useBalance({ address: account.address });
  const { price, fetchPrice } = useCryptoPrice({ enabled: false });

  useEffect(() => {
    if (balance.length > 0) return;
    fetchPrice();
  }, [balance]);

  return (
    <VStack
      bgColor="white"
      borderWidth={'1'}
      borderRadius={'2xl'}
      borderColor={'gray.200'}
      pt={'8'}
      pb={'4'}
      pl={'6'}
      pr={'4'}
    >
      <HStack space={'6'}>
        <View
          borderWidth={1}
          borderRadius={'full'}
          borderColor={'gray.200'}
          w={WINDOW_WIDTH * 0.17}
          h={WINDOW_WIDTH * 0.17}
          p={3}
        >
          <Image
            source={require('../../../../assets/images/lukso_logo.png')}
            alt="LYX token"
            w={'full'}
            h={'full'}
          />
        </View>

        <VStack space={0.2}>
          <Text fontSize={'sm'} bold>
            {network.name.toUpperCase()}
          </Text>

          <HStack alignItems={'center'} space={2}>
            <Text fontSize={'2xl'} bold>
              {balance !== '' && balance}
            </Text>
            <Text fontSize={'md'} bold color={'gray.400'}>
              {network.token}
            </Text>
          </HStack>
          <Text fontSize={'sm'} fontWeight={'medium'} color={'gray.600'}>
            $
            {price &&
              balance.length > 0 &&
              (price * Number(balance)).toFixed(2)}
          </Text>
        </VStack>
      </HStack>

      <Pressable
        // @ts-ignore
        onPress={() => navigation.navigate('Transfer')}
        alignSelf={'flex-end'}
        mt={3}
        px={'4'}
        py={'1'}
        borderWidth={'1'}
        borderRadius={'2xl'}
        borderColor={'gray.300'}
      >
        <Text fontWeight={'medium'}>Send</Text>
      </Pressable>
    </VStack>
  );
}
