import { ethers } from 'ethers';
import { Icon, Input, Pressable, Text, View, VStack } from 'native-base';
import React from 'react';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Blockie from '../../../components/Blockie';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';
import { useModal } from 'react-native-modalfy';

type Props = {
  recipient: string;
  error: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function Recipient({
  recipient,
  error,
  onChange,
  onSubmit
}: Props) {
  const {openModal} = useModal()

  const scanQRCode = () => {
    openModal("QRCodeScanner", {
      onScan: onChange
    })
  }
  return (
    <VStack space="2">
      <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
        To:
      </Text>

      <Input
        value={recipient}
        borderRadius="lg"
        variant="filled"
        fontSize="md"
        focusOutlineColor={COLORS.primary}
        InputLeftElement={
          ethers.isAddress(recipient) ? (
            <View ml="2">
              <Blockie address={recipient} size={1.8 * FONT_SIZE['xl']} />
            </View>
          ) : undefined
        }
        InputRightElement={
          <Pressable onPress={scanQRCode} mr={3}>
            <Icon
              as={<MaterialCommunityIcons name="qrcode-scan" />}
              size={1.3 * FONT_SIZE['xl']}
              color={COLORS.primary}
            />
          </Pressable>
        }
        placeholder="Recipient Address"
        onChangeText={onChange}
        _input={{
          selectionColor: COLORS.primary,
          cursorColor: COLORS.primary
        }}
        onSubmitEditing={onSubmit}
      />

      {error && (
        <Text fontSize={FONT_SIZE['md']} color="red.400">
          {error}
        </Text>
      )}
    </VStack>
  );
}
