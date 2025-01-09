import { ethers } from 'ethers';
import { HStack, Input, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  amount: string;
  isNativeToken?: boolean;
  token: string;
  tokenImage: JSX.Element;
  balance: bigint | null;
  gasCost: bigint | null;
  onChange: (value: string) => void;
  onConfirm: () => void;
};

export default function Amount({
  amount,
  token,
  tokenImage,
  balance,
  gasCost,
  onChange,
  onConfirm
}: Props) {
  const [error, setError] = useState('');

  const handleInputChange = (value: string) => {
    onChange(value);

    let amount = Number(value);

    if (value.trim() && balance && !isNaN(amount) && gasCost) {
      if (amount >= Number(ethers.formatEther(balance))) {
        setError('Insufficient amount');
      } else if (Number(ethers.formatEther(balance - gasCost)) < amount) {
        setError('Insufficient amount for gas');
      } else if (error) {
        setError('');
      }
    } else if (error) {
      setError('');
    }
  };

  return (
    <VStack space="2">
      <HStack alignItems="center" space="2">
        <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
          Amount:
        </Text>
      </HStack>

      <Input
        value={amount}
        borderRadius="lg"
        variant="filled"
        fontSize="lg"
        focusOutlineColor={COLORS.primary}
        placeholder={`0 ${token}`}
        onChangeText={handleInputChange}
        _input={{
          selectionColor: COLORS.primary,
          cursorColor: COLORS.primary
        }}
        onSubmitEditing={onConfirm}
        keyboardType="number-pad"
        InputLeftElement={tokenImage}
      />

      {error && (
        <Text fontSize={FONT_SIZE['md']} color="red.400">
          {error}
        </Text>
      )}
    </VStack>
  );
}
