import { useNavigation } from '@react-navigation/native';
import { HStack, Icon, Pressable, Text } from 'native-base';
import React from 'react';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  token: string;
};

export default function Header({ token }: Props) {
  const navigation = useNavigation();
  return (
    <HStack alignItems="center" space={2}>
      <Pressable
        onPress={() => navigation.goBack()}
        _pressed={{ opacity: 0.4 }}
      >
        <Icon
          as={<Ionicons name="arrow-back-outline" />}
          size={1.3 * FONT_SIZE['xl']}
          color="black"
        />
      </Pressable>
      <Text fontSize={1.2 * FONT_SIZE['lg']} bold>
        Send {token}
      </Text>
    </HStack>
  );
}
