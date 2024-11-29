import { VStack } from 'native-base';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      data: string;
    };
  };
};

export default function QRCodeModal({ modal: { closeModal, params } }: Props) {
  return (
    <VStack
      bgColor="white"
      borderRadius="30"
      p="5"
      alignItems="center"
      justifyContent={'center'}
      space="4"
      w={WINDOW_WIDTH * 0.9}
      h={WINDOW_WIDTH}
    >
      <QRCode value={params.data} size={12 * FONT_SIZE['xl']} />
    </VStack>
  );
}
