import { ethers } from 'ethers';
import { Icon, Input, Text, View } from 'native-base';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import Blockie from '../Blockie';

type Props = {
    children?: JSX.Element
};

export default function ProfileInput({children}: Props) {
  const [address, setAddress] = useState('');

  const handleAddressChange = (_address: string) => {
    setAddress(_address);
  };
  return (
    <View>
      <Input
        value={address}
        borderRadius="lg"
        variant="filled"
        fontSize="md"
        focusOutlineColor={COLORS.primary}
        InputLeftElement={
          ethers.utils.isAddress(address) ? (
            <View ml="2">
              <Blockie address={address} size={1.8 * FONT_SIZE['xl']} />
            </View>
          ) : undefined
        }
        InputRightElement={
          <TouchableOpacity style={{ marginRight: 10 }}>
            <Icon
              as={<MaterialCommunityIcons name="qrcode-scan" />}
              size={1.3 * FONT_SIZE['xl']}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        }
        placeholder="Recipient Address"
        onChangeText={handleAddressChange}
        _input={{
          selectionColor: COLORS.primary,
          cursorColor: COLORS.primary
        }}
        //   onSubmitEditing={confirm}
      />

      {children}

      <View 
        position="absolute"
        top="12"
        borderWidth="1"
        borderColor="gray.200"

        w="100%"
        h={100}
      >
      </View>
    </View>
  );
}
