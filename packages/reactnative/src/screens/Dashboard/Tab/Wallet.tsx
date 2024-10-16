import {
  HStack,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base';
import React, {useEffect} from 'react';
import {BackHandler, NativeEventSubscription, StatusBar} from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';

import {WINDOW_WIDTH} from '../../../styles/screenDimensions';

import {COLORS} from '../../../utils/constants';
import {FONT_SIZE} from '../../../utils/styles';
import {truncateAddress} from '../../../utils/helperFunctions';

import Blockie from '../../../components/Blockie';
import CopyableText from '../../../components/CopyableText';

import useAccount from '../../../hooks/scaffold-eth/useAccount';

import {useProfile} from '../../../context/ProfileContext';

import Assets from './modules/wallet/Assets';
import Link, {LinkProps} from './modules/wallet/Link';
import {useIPFSGateway} from '../../../hooks/useIPFSGateway';
import ProfileImages from './modules/wallet/ProfileImages';

let backHandler: NativeEventSubscription;

type WalletProps = {};

function Wallet({}: WalletProps) {
  const isFocused = useIsFocused();
  const {profile} = useProfile();
  const account = useAccount();
  const navigation = useNavigation();

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

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
      bgColor={'white'}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'transparent'}
      />

      <ProfileImages 
        coverImageURL={profile?.backgroundImage && profile.backgroundImage.length > 0 ? profile.backgroundImage[0].url : null}
        profileImageURL={profile?.profileImage && profile.profileImage.length > 0 ? profile.profileImage[0].url : null}
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
          fontWeight={'medium'}>
          Edit profile
        </Text>
      </Pressable>

      <VStack px={'2'}>
        {/* Username */}
        <Text color={COLORS.primary} fontSize={FONT_SIZE['xl'] * 1.2} bold>
          @{profile?.name || 'anonymous'}
        </Text>

        {/* Profile address */}
        <CopyableText
          displayText={truncateAddress(account.address)}
          value={account.address}
          textStyle={{
            fontSize: FONT_SIZE['xl'],
            fontWeight: '400',
            color: 'gray',
          }}
          iconStyle={{color: COLORS.primary}}
        />

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
                borderRadius={'md'}
                borderColor={'gray.300'}
                alignSelf={'flex-start'}>
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
