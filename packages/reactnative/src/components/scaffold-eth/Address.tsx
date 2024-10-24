import Clipboard from '@react-native-clipboard/clipboard';
import { HStack, Icon, Pressable, Text } from 'native-base';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { COLORS } from '../../utils/constants';
import { truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';
import Blockie from '../Blockie';

type Props = {
  address: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: TextStyle;
};

export default function Address({
  address,
  containerStyle,
  textStyle,
  iconStyle,
  displayText
}: Props) {
  const toast = useToast();

  const copy = () => {
    Clipboard.setString(address);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };
  return (
    <HStack
      alignItems="center"
      alignSelf={'flex-start'}
      space={1}
      style={containerStyle}
    >
      <Blockie address={address} size={1.3 * FONT_SIZE['xl']} />
      <Text textAlign="center" fontWeight="medium" style={textStyle}>
        {truncateAddress(address)}
      </Text>
      <Pressable onPress={copy}>
        <Icon
          as={<Ionicons name="copy-outline" />}
          size={5}
          color={COLORS.primary}
          style={iconStyle}
        />
      </Pressable>
    </HStack>
  );
}
