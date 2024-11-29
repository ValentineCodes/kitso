import {
  HStack,
  Icon,
  Image,
  Pressable,
  Text,
  View,
  VStack
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useModal } from 'react-native-modalfy';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { useProfile } from '../../context/ProfileContext';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import { useCryptoPrice } from '../../hooks/scaffold-eth/useCryptoPrice';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useIPFSGateway } from '../../hooks/useIPFSGateway';
import useWallet, { Controller } from '../../hooks/useWallet';
import { WINDOW_WIDTH } from '../../styles/screenDimensions';
import { truncateAddress } from '../../utils/helperFunctions';
import Blockie from '../Blockie';
import CopyableText from '../CopyableText';

export type AccountType = 'profile' | 'controller' | 'keymanager';

interface AccountCardProps {
  type: AccountType;
}

export default function Account({ type }: AccountCardProps) {
  const account = useAccount();
  const { getController } = useWallet();
  const network = useNetwork();
  const { openModal } = useModal();

  const [controller, setController] = useState<Controller>();

  const { profile } = useProfile();
  const { parseIPFSUrl } = useIPFSGateway();

  const _getAccountAddress = (): string => {
    if (type === 'profile') {
      return account.address;
    } else {
      return account.keyManager;
    }
  };

  const getAccountAddress = (): string => {
    return type === 'controller' && controller
      ? controller?.address
      : _getAccountAddress();
  };

  useEffect(() => {
    (async () => {
      const controller = await getController();
      setController(controller);
    })();
  }, []);

  const { balance } = useBalance({ address: getAccountAddress() });
  const { price } = useCryptoPrice({ enabled: true });

  const renderProfileCoverImage = () => {
    if (profile?.backgroundImage && profile.backgroundImage.length > 0) {
      return (
        <Image
          source={{ uri: parseIPFSUrl(profile.backgroundImage[0].url) }}
          alt="profile cover"
          w={'full'}
          h={'full'}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <Image
          source={require('../../../assets/images/default_profile_cover.jpg')}
          alt="profile cover"
          w={'full'}
          h={'full'}
          resizeMode="cover"
        />
      );
    }
  };

  const renderProfileImage = () => {
    if (profile?.profileImage && profile.profileImage.length > 0) {
      return (
        <Image
          source={{ uri: parseIPFSUrl(profile.profileImage[0].url) }}
          alt="profile image"
          w={'full'}
          h={'full'}
          resizeMode="cover"
          borderRadius={'full'}
        />
      );
    } else {
      return <Blockie address={account.address} size={WINDOW_WIDTH * 0.12} />;
    }
  };
  return (
    <View
      w={WINDOW_WIDTH * 0.7}
      h={WINDOW_WIDTH * 0.6}
      borderWidth={1}
      borderColor={'gray.200'}
      borderRadius={'lg'}
      bg={'white'}
    >
      <View bg={'gray.200'} w={'full'} height={WINDOW_WIDTH * 0.3}>
        {/* Cover Box */}
        {type === 'profile' ? (
          renderProfileCoverImage()
        ) : type === 'controller' ? (
          <View flex={1} justifyContent={'center'} alignItems={'center'}>
            <Text fontSize={'lg'} fontWeight={'medium'}>
              Controller
            </Text>
          </View>
        ) : (
          <View flex={1} justifyContent={'center'} alignItems={'center'}>
            <Text fontSize={'lg'} fontWeight={'medium'}>
              Key Manager
            </Text>
          </View>
        )}

        {/* Profile Box */}
        <VStack
          position={'absolute'}
          left={'4'}
          bottom={-((WINDOW_WIDTH * 0.14) / 2)}
          alignItems={'flex-start'}
        >
          <View
            w={WINDOW_WIDTH * 0.14}
            style={{ aspectRatio: 1 }}
            borderRadius={'full'}
            borderWidth={2}
            borderColor={'white'}
            bgColor={'green.100'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            {type === 'profile' ? (
              renderProfileImage()
            ) : (
              <Blockie
                address={getAccountAddress()}
                size={WINDOW_WIDTH * 0.12}
              />
            )}
          </View>
        </VStack>
      </View>

      <VStack px={2} flex={1} space={3}>
        <HStack alignSelf={'flex-end'} space={2} mt={1}>
          <HStack alignItems={'center'} space={2}>
            <Text fontSize={'md'} bold>
              {balance !== '' && balance}
            </Text>
            <Text fontSize={'md'} bold color={'gray.400'}>
              {network.token}
            </Text>
          </HStack>
          <Text
            fontSize={'sm'}
            fontWeight={'medium'}
            color={'green.400'}
            borderWidth={1}
            borderColor={'green.400'}
            borderRadius={'3xl'}
            px={2}
            py={0.2}
          >
            $
            {price &&
              balance.length > 0 &&
              (price * Number(balance)).toFixed(2)}
          </Text>
        </HStack>

        <CopyableText
          value={getAccountAddress()}
          displayText={truncateAddress(getAccountAddress())}
          textStyle={{ fontSize: 16 }}
        />

        {type === 'controller' && (
          <HStack alignItems={'center'} space={2}>
            <Text fontSize={'2xl'}>**********</Text>

            <Pressable onPress={() => openModal('PrivateKeyModal')}>
              <Icon
                as={<MaterialIcons name="visibility-off" />}
                size={5}
                color="muted.400"
              />
            </Pressable>
          </HStack>
        )}
      </VStack>
    </View>
  );
}
