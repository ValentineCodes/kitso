import Clipboard from '@react-native-clipboard/clipboard';
import {
  Divider,
  HStack,
  Icon,
  Pressable,
  Text,
  View,
  VStack
} from 'native-base';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { WINDOW_WIDTH } from '../../styles/screenDimensions';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function ReceiveModal({ modal: { closeModal } }: Props) {
  const network = useNetwork();
  const account = useAccount();

  const toast = useToast();

  const copyAddress = () => {
    Clipboard.setString(account.address);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  const shareAddress = async () => {
    try {
      await Share.open({ message: account.address });
    } catch (error) {
      return;
    }
  };

  return (
    <VStack
      bgColor="white"
      borderRadius="30"
      p="5"
      space={4}
      alignItems="center"
      w={WINDOW_WIDTH * 0.9}
    >
      <HStack alignItems="center" justifyContent="space-between" w="full">
        <Text fontSize={FONT_SIZE['xl']} bold>
          Receive {network.token}
        </Text>
        <Pressable onPress={closeModal} _pressed={{ opacity: 0.4 }}>
          <Icon
            as={<Ionicons name="close-outline" />}
            size={1.5 * FONT_SIZE['xl']}
          />
        </Pressable>
      </HStack>

      <Divider bgColor="muted.100" />

      <QRCode value={account.address} size={12 * FONT_SIZE['xl']} />

      <Text fontSize={FONT_SIZE['xl']} fontWeight="medium" textAlign="center">
        {account.address}
      </Text>

      <Divider bgColor="muted.100" />

      <Text fontSize={FONT_SIZE['md']} textAlign="center">
        Send only {network.name} ({network.token}) to this address. Sending any
        other coins may result in permanent loss.
      </Text>

      <HStack alignItems="center" space="10" mt="5">
        <Pressable alignItems="center" onPress={copyAddress}>
          {({ isPressed }) => (
            <>
              <View
                bgColor={
                  isPressed ? 'rgba(39, 184, 88, 0.2)' : COLORS.primaryLight
                }
                p="4"
                borderRadius="full"
              >
                <Icon
                  as={<Ionicons name="reader" />}
                  size={1.2 * FONT_SIZE['xl']}
                  color={COLORS.primary}
                  borderRadius="full"
                />
              </View>
              <Text fontSize={FONT_SIZE['lg']} bold mt="2">
                Copy
              </Text>
            </>
          )}
        </Pressable>

        <Pressable alignItems="center" onPress={shareAddress}>
          {({ isPressed }) => (
            <>
              <View
                bgColor={
                  isPressed ? 'rgba(39, 184, 88, 0.2)' : COLORS.primaryLight
                }
                p="4"
                borderRadius="full"
              >
                <Icon
                  as={<Ionicons name="paper-plane" />}
                  size={1.2 * FONT_SIZE['xl']}
                  color={COLORS.primary}
                  borderRadius="full"
                />
              </View>
              <Text fontSize={FONT_SIZE['lg']} bold mt="2">
                Share
              </Text>
            </>
          )}
        </Pressable>
      </HStack>
    </VStack>
  );
}
