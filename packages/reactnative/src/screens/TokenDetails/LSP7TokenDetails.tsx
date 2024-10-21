import Clipboard from '@react-native-clipboard/clipboard';
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
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Blockie from '../../components/Blockie';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { COLORS } from '../../utils/constants';
import { truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import { LinkProps } from '../Dashboard/Tab/modules/wallet/Link';

type Props = {};

export default function LSP7TokenDetails({}: Props) {
  const navigation = useNavigation();
  const toast = useToast();
  const network = useNetwork();

  const openURL = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(error);
      toast.show('Failed to open URL', { type: 'danger' });
    }
  };

  const copyContractAddress = () => {
    Clipboard.setString('0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce');
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  const transferLyx = () => {
    // @ts-ignore
    navigation.navigate('Transfer');
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      bgColor="#F9FAFB"
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
          borderRadius={'xl'}
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
            borderRadius={'xl'}
            borderColor={'gray.300'}
            fontWeight={'medium'}
            fontSize="lg"
          >
            Send LYX
          </Text>
        </Pressable>

        <VStack space="2">
          <Text bold fontSize="xl">
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

        <VStack space="2">
          <Text bold fontSize="md">
            Token Images
          </Text>

          <View
            borderRadius="lg"
            w={WINDOW_WIDTH * 0.15}
            h={WINDOW_WIDTH * 0.15}
          >
            <Image
              source={require('../../../assets/images/lukso_logo.png')}
              alt="LYX token"
              w={'full'}
              h={'full'}
            />
          </View>
        </VStack>

        <VStack space="2">
          <Text bold fontSize="md">
            Attributes
          </Text>

          <VStack
            px="4"
            py="2"
            borderWidth={0.5}
            borderRadius={'xl'}
            borderColor={'gray.300'}
            bgColor="white"
            space={2}
          >
            <Text textTransform="uppercase" bold fontSize="xs">
              standard type
            </Text>
            <Text fontSize="md">PSP</Text>
          </VStack>
        </VStack>

        <VStack space="2">
          <Text bold fontSize="md" mb={1}>
            Creators
          </Text>

          <Pressable bgColor="white">
            <HStack
              justifyContent="space-between"
              alignItems="center"
              px="4"
              py="2"
              borderWidth={0.5}
              borderRadius={'xl'}
              borderColor={'gray.300'}
              bgColor="white"
            >
              <HStack
                alignItems="center"
                justifyContent="space-between"
                space={1}
              >
                <View
                  w="10"
                  style={{ aspectRatio: 1 }}
                  borderRadius={'full'}
                  borderWidth={5}
                  borderColor={'white'}
                >
                  <Image
                    source={require('../../../assets/images/default_profile_image.jpeg')}
                    alt="profile image"
                    w={'full'}
                    h={'full'}
                    resizeMode="cover"
                    borderRadius={'full'}
                  />
                  <View
                    position={'absolute'}
                    bottom={0}
                    right={0}
                    borderWidth={3}
                    borderColor={'white'}
                    borderRadius={'full'}
                  >
                    <Blockie
                      address={'0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce'}
                      size={10}
                    />
                  </View>
                </View>
                <HStack alignItems={'center'}>
                  <Text color={'black'} bold>
                    @edthedrunk
                  </Text>

                  <Text bold color={'gray.400'}>
                    #d874
                  </Text>
                </HStack>
              </HStack>

              <Icon
                as={<Ionicons name="checkmark-circle" />}
                size={5}
                color={COLORS.primary}
              />
            </HStack>
          </Pressable>
        </VStack>

        <VStack>
          <Text bold fontSize="md" mb={1}>
            Links
          </Text>

          {[{ title: 'website', url: 'https:valentineorga.vercel.app' }].map(
            (link: LinkProps) => (
              <Pressable key={link.url} onPress={() => openURL(link.url)}>
                <HStack
                  alignItems={'center'}
                  space={2}
                  mb={4}
                  px="6"
                  py="3"
                  borderWidth={0.5}
                  borderRadius={'xl'}
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
                    {link.title}
                  </Text>
                </HStack>
              </Pressable>
            )
          )}
        </VStack>

        <VStack space="2">
          <Text bold fontSize="md">
            Contract Address
          </Text>
          <HStack
            justifyContent="space-between"
            alignItems={'center'}
            mb={4}
            px="4"
            py="3"
            borderWidth={0.5}
            borderRadius={'xl'}
            borderColor={'gray.300'}
            bgColor="white"
          >
            <HStack alignItems="center" space={2}>
              <Blockie
                address={'0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce'}
                size={25}
              />
              <Text bold fontSize="sm">
                {truncateAddress('0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce')}
              </Text>
            </HStack>
            <HStack alignItems="center" space={3}>
              <Icon
                as={<Ionicons name="copy-outline" />}
                size={5}
                onPress={copyContractAddress}
              />
              {network.blockExplorer && (
                <Icon
                  as={<Ionicons name="open-outline" />}
                  size={5}
                  onPress={() =>
                    openURL(
                      `${network.blockExplorer}address/0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce`
                    )
                  }
                />
              )}
            </HStack>
          </HStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
