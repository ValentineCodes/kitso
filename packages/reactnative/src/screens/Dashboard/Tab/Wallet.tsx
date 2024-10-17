import Clipboard from '@react-native-clipboard/clipboard';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation
} from '@react-navigation/native';
import { HStack, Pressable, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { BackHandler, NativeEventSubscription, StatusBar } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useProfile } from '../../../context/ProfileContext';
import useAccount from '../../../hooks/scaffold-eth/useAccount';
import { COLORS } from '../../../utils/constants';
import { getFirst4Hex } from '../../../utils/helperFunctions';
import { FONT_SIZE } from '../../../utils/styles';
import Assets from './modules/wallet/Assets';
import Link, { LinkProps } from './modules/wallet/Link';
import ProfileImages from './modules/wallet/ProfileImages';

let backHandler: NativeEventSubscription;

type WalletProps = {};

function Wallet({}: WalletProps) {
  const isFocused = useIsFocused();
  const { profile } = useProfile();
  const account = useAccount();
  const navigation = useNavigation();
  const toast = useToast();

  useFocusEffect(() => {
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();

      return true;
    });
  });

  useEffect(() => {
    return () => {
      backHandler?.remove();
    };
  }, []);

  if (!isFocused) return;

  const copyAddress = () => {
    Clipboard.setString(account.address);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} bgColor={'white'}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'transparent'}
      />

      <ProfileImages
        coverImageURL={
          profile?.backgroundImage && profile.backgroundImage.length > 0
            ? profile.backgroundImage[0].url
            : null
        }
        profileImageURL={
          profile?.profileImage && profile.profileImage.length > 0
            ? profile.profileImage[0].url
            : null
        }
      />

      {/* @ts-ignore */}
      <Pressable onPress={() => navigation.navigate('EditProfile')}>
        <Text
          alignSelf={'flex-end'}
          mt={3}
          mr={2}
          px={'4'}
          py={'1'}
          borderWidth={'1'}
          borderRadius={'2xl'}
          borderColor={'gray.300'}
          fontWeight={'medium'}
        >
          Edit profile
        </Text>
      </Pressable>

      <VStack px={'2'} pb={2}>
        {/* Username */}
        <Pressable
          onPress={copyAddress}
          flexDir="row"
          alignItems="center"
          _pressed={{ opacity: 0.7 }}
        >
          <Text color={COLORS.primary} fontSize={FONT_SIZE['xl'] * 1.2} bold>
            @{profile?.name || 'anonymous'}
          </Text>
          <Text color="gray.400" fontSize={FONT_SIZE['xl']} bold>
            #{getFirst4Hex(account.address)}
          </Text>
        </Pressable>

        {/* Bio */}
        {!!profile?.description && (
          <Text fontSize={'md'} fontWeight={'normal'} my={2}>
            {profile.description}
          </Text>
        )}

        {/* Links */}
        {!!profile?.links && (
          <HStack flexWrap={'wrap'} space={'2'} mb={1}>
            {profile.links.map((link: LinkProps) => (
              <Link key={link.url} title={link.title} url={link.url} />
            ))}
          </HStack>
        )}

        {/* Tags */}
        {!!profile?.tags && (
          <HStack flexWrap={'wrap'} space={'2'}>
            {profile.tags.map((tag: string) => (
              <Text
                key={tag}
                fontSize={'sm'}
                fontWeight={'light'}
                mt={2}
                px={2}
                py={0.5}
                borderWidth={'1'}
                borderRadius={'2xl'}
                borderColor={'gray.300'}
                alignSelf={'flex-start'}
              >
                {tag}
              </Text>
            ))}
          </HStack>
        )}
      </VStack>

      <Assets />
    </ScrollView>
  );
}

export default Wallet;
