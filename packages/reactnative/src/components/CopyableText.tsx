import Clipboard from '@react-native-clipboard/clipboard';
import { HStack, Icon, Text } from 'native-base';
import React from 'react';
import { TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

type Props = {
  value: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: TextStyle;
  displayText?: string;
};

export default function CopyableText({
  value,
  containerStyle,
  textStyle,
  iconStyle,
  displayText
}: Props) {
  const toast = useToast();

  const copy = () => {
    Clipboard.setString(value);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };
  return (
    <TouchableOpacity activeOpacity={0.4} onPress={copy}>
      <HStack alignItems="center" space={1} style={containerStyle}>
        <Text textAlign="center" fontWeight="medium" style={textStyle}>
          {displayText || value}
        </Text>
        <Icon
          as={<Ionicons name="copy-outline" />}
          size={5}
          style={iconStyle}
        />
      </HStack>
    </TouchableOpacity>
  );
}
