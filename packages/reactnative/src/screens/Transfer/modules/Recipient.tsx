import { ethers } from 'ethers';
import { Icon, Input, Pressable, Text, View, VStack } from 'native-base';
import React, { useState } from 'react';
import { useModal } from 'react-native-modalfy';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Blockie from '../../../components/Blockie';
import { ALCHEMY_KEY, COLORS } from '../../../utils/constants';
import { isENS } from '../../../utils/helperFunctions';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  recipient: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function Recipient({ recipient, onChange, onSubmit }: Props) {
  const { openModal } = useModal();

  const [error, setError] = useState('');

  const scanQRCode = () => {
    openModal('QRCodeScanner', {
      onScan: onChange
    });
  };

  const handleInputChange = async (value: string) => {
    onChange(value);

    if (error) {
      setError('');
    }

    if (isENS(value)) {
      try {
        const provider = new ethers.JsonRpcProvider(
          `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`
        );

        const address = await provider.resolveName(value);

        if (address && ethers.isAddress(address)) {
          onChange(address);
        } else {
          setError('Invalid ENS');
        }
      } catch (error) {
        setError('Could not resolve ENS');
        return;
      }
    }
  };
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
        onChangeText={handleInputChange}
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
