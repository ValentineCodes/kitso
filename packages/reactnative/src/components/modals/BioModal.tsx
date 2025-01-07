import {
  Divider,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack
} from 'native-base';
import React from 'react';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { WINDOW_WIDTH } from '../../styles/screenDimensions';
import { FONT_SIZE, WINDOW_HEIGHT } from '../../utils/styles';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      bio: string;
    };
  };
};

export default function BioModal({ modal: { closeModal, params } }: Props) {
  return (
    <VStack
      bgColor="white"
      borderRadius="30"
      p="5"
      space={2}
      alignItems="center"
      w={WINDOW_WIDTH * 0.9}
      maxH={WINDOW_HEIGHT * 0.7}
    >
      <HStack alignItems="center" justifyContent="space-between" w="full">
        <Text fontSize={FONT_SIZE['xl']} bold>
          Bio
        </Text>
        <Pressable onPress={closeModal} _pressed={{ opacity: 0.4 }}>
          <Icon
            as={<Ionicons name="close-outline" />}
            size={1.5 * FONT_SIZE['xl']}
          />
        </Pressable>
      </HStack>

      <Divider bgColor="muted.100" />

      <ScrollView>
        <Text fontSize={'md'} fontWeight={'normal'}>
          {params.bio}
        </Text>
      </ScrollView>
    </VStack>
  );
}
