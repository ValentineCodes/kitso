import { useNavigation } from '@react-navigation/native';
import {
  HStack,
  Icon,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  VStack
} from 'native-base';
import React from 'react';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import useURL from '../../hooks/useURL';

type Props = {};

export default function NetworkTokenDetails({}: Props) {
  const navigation = useNavigation();
  const {openURL} = useURL()

  const transferLyx = () => {
    // @ts-ignore
    navigation.navigate('Transfer');
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      bgColor={COLORS.background}
      p="4"
    >
      <Pressable
        onPress={() => navigation.goBack()}
        _pressed={{ opacity: 0.4 }}
        mb={'4'}
      >
        <Icon
          as={<Ionicons name="arrow-back-outline" />}
          size={1.3 * FONT_SIZE['xl']}
          color="black"
        />
      </Pressable>

      <VStack flex={1} space="6">
        <View
          w="full"
          style={{ aspectRatio: 16 / 9 }}
          justifyContent="center"
          alignItems="center"
          bgColor="white"
          borderWidth={0.5}
          borderRadius={'2xl'}
          borderColor={'gray.200'}
        >
          <View
            borderWidth={1}
            borderRadius={'full'}
            borderColor={'gray.200'}
            w={WINDOW_WIDTH * 0.17}
            h={WINDOW_WIDTH * 0.17}
            p={3}
          >
            <Image
              source={require('../../../assets/images/lukso_logo.png')}
              alt="LYX token"
              w={'full'}
              h={'full'}
            />
          </View>
        </View>

        <Pressable onPress={transferLyx} bgColor="white">
          <Text
            py="3"
            textAlign="center"
            borderWidth={0.5}
            borderRadius={'2xl'}
            borderColor={'gray.300'}
            fontWeight={'medium'}
            fontSize="lg"
          >
            Send LYX
          </Text>
        </Pressable>

        <VStack space="2">
          <Text bold fontSize="2xl">
            LUKSO
          </Text>
          <Text fontSize="sm">Total supply of 42,000,000</Text>
        </VStack>

        <VStack space="2">
          <Text bold fontSize="md">
            Token Description
          </Text>
          <Text fontSize="sm">
            This is the native token of the LUKSO blockchain.
          </Text>
        </VStack>

        <VStack>
          <Text bold fontSize="md" mb={1}>
            Links
          </Text>

          {['www.lukso.network', 'www.docs.lukso.tech'].map(url => (
            <Pressable key={url} onPress={() => openURL(url)}>
              <HStack
                alignItems={'center'}
                space={2}
                mb={4}
                px="6"
                py="3"
                borderWidth={0.5}
                borderRadius={'2xl'}
                borderColor={'gray.300'}
                bgColor="white"
              >
                <Icon
                  as={<Ionicons name="link-outline" />}
                  size={FONT_SIZE['lg']}
                  color="black"
                  rotation={-45}
                />
                <Text bold fontSize={'md'} fontWeight={'light'}>
                  {url}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </VStack>
    </ScrollView>
  );
}
