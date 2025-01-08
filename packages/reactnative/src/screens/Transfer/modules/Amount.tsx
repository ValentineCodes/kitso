import { HStack, Input, Text, VStack } from 'native-base';
import React from 'react';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  amount: string;
  isNativeToken?: boolean;
  error: string;
  token: string;
  tokenImage: JSX.Element;
  onChange: (value: string) => void;
  onConfirm: () => void;
};

export default function Amount({
  amount,
  error,
  token,
  tokenImage,
  onChange,
  onConfirm
}: Props) {
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
        onChangeText={onChange}
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
