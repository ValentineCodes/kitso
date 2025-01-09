import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { HStack, Image, Pressable, Text, View, VStack } from 'native-base';
import React from 'react';
import useTokenBalance from '../../../hooks/useTokenBalance';
import { getFirstSixHex } from '../../../utils/helperFunctions';
import { WINDOW_WIDTH } from '../../../utils/styles';
import Blockie from '../../Blockie';

type Props = {
  address: string;
  image: string | null;
  name: string;
  symbol: string;
};

export default function LSP7Token({ address, image, name, symbol }: Props) {
  const navigation = useNavigation();

  const { balance } = useTokenBalance({ tokenAddress: address, type: 'LSP7' });

  return (
    <VStack
      bgColor="white"
      borderWidth={'1'}
      borderRadius={'2xl'}
      borderColor={'gray.200'}
      mt={2}
      pt={'8'}
      pb={'4'}
      pl={'6'}
      pr={'4'}
    >
      <HStack space={'6'}>
        <VStack alignItems={'center'} space={2}>
          {/* Profile image */}
          <Pressable>
            {image ? (
              <Image
                source={{ uri: image }}
                alt="LSP7 token"
                w={WINDOW_WIDTH * 0.17}
                h={WINDOW_WIDTH * 0.17}
                rounded={'full'}
              />
            ) : (
              <Image
                source={require('../../../../assets/images/lukso_logo.png')}
                alt="LSP7 token"
                w={WINDOW_WIDTH * 0.17}
                h={WINDOW_WIDTH * 0.17}
                rounded={'full'}
              />
            )}
            <View
              position={'absolute'}
              bottom={0}
              right={0}
              borderWidth={3}
              borderColor={'white'}
              borderRadius={'full'}
            >
              <Blockie address={address} size={20} />
            </View>
          </Pressable>

          <Text fontWeight={'semibold'} color={'gray.400'}>
            #{getFirstSixHex(address)}
          </Text>
        </VStack>

        <VStack space={0.2}>
          <Text fontSize={'sm'} bold>
            {name}
          </Text>

          <HStack alignItems={'center'} space={2}>
            <Text fontSize={'2xl'} bold>
              {balance !== null ? Number(ethers.formatEther(balance)) : null}
            </Text>
            <Text fontSize={'md'} bold color={'gray.400'}>
              {symbol}
            </Text>
          </HStack>
        </VStack>
      </HStack>

      <Pressable
        // @ts-ignore
        onPress={() =>
          navigation.navigate('LSP7TokenTransfer', {
            tokenAddress: address,
            metadata: {
              name,
              symbol,
              image
            }
          })
        }
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

      <Text
        position={'absolute'}
        top={4}
        right={4}
        bg={'purple.100'}
        borderRadius={'md'}
        fontSize={'xs'}
        px={2}
        py={1}
      >
        LSP7
      </Text>
    </VStack>
  );
}
