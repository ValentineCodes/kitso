import Clipboard from '@react-native-clipboard/clipboard';
import {
  HStack,
  Icon,
  Input,
  Pressable,
  Button as RNButton,
  Text,
  VStack
} from 'native-base';
import React, { useState } from 'react';
import { useModal } from 'react-native-modalfy';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { Security } from '../../hooks/useSecurity';
import useWallet from '../../hooks/useWallet';
import { WINDOW_WIDTH } from '../../styles/screenDimensions';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import Button from '../Button';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function PrivateKeyModal({ modal: { closeModal } }: Props) {
  const toast = useToast();
  const { getController } = useWallet();
  const { openModal } = useModal();

  const { getItem } = useSecureStorage();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const showPrivateKey = async () => {
    if (!password) {
      setError('Password cannot be empty');
      return;
    }

    const security = (await getItem('security')) as Security;

    if (password !== security.password) {
      setError('Incorrect password!');
      return;
    }

    const controller = await getController();

    setPrivateKey(controller.privateKey);
  };

  const handleInputChange = (value: string) => {
    setPassword(value);
    if (error) {
      setError('');
    }
  };

  const copyPrivateKey = () => {
    Clipboard.setString(privateKey);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  const handleOnClose = () => {
    closeModal();
    setPrivateKey('');
    setPassword('');
  };

  return (
    <VStack
      bgColor="white"
      borderRadius="30"
      p="5"
      alignItems="center"
      space="4"
      w={WINDOW_WIDTH * 0.9}
    >
      <HStack
        alignItems="center"
        justifyContent="space-between"
        space="2"
        w="full"
      >
        <Text fontSize={FONT_SIZE['xl']} bold>
          Show private key
        </Text>
        <Pressable onPress={handleOnClose} _pressed={{ opacity: 0.4 }}>
          <Icon
            as={<Ionicons name="close-outline" />}
            size={1.5 * FONT_SIZE['xl']}
            color="black"
          />
        </Pressable>
      </HStack>

      {privateKey ? (
        <HStack
          alignItems="center"
          w="full"
          borderWidth="1"
          borderColor={COLORS.primary}
          borderRadius={10}
          p="4"
        >
          <Text fontSize={FONT_SIZE['lg']} w="90%" mr="2">
            {privateKey}
          </Text>
          <VStack alignItems={'center'} space={4}>
            <Pressable onPress={copyPrivateKey} _pressed={{ opacity: 0.4 }}>
              <Icon
                as={<Ionicons name="copy" />}
                size={5}
                color={COLORS.primary}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                openModal('QRCodeModal', {
                  data: privateKey
                })
              }
              _pressed={{ opacity: 0.4 }}
            >
              <Icon
                as={<Ionicons name="qr-code-outline" />}
                size={5}
                color={'black'}
              />
            </Pressable>
          </VStack>
        </HStack>
      ) : (
        <VStack w="full" space={2}>
          <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
            Enter your password
          </Text>
          <Input
            value={password}
            borderRadius="lg"
            variant="filled"
            fontSize="md"
            focusOutlineColor={COLORS.primary}
            secureTextEntry
            placeholder="Password"
            onChangeText={handleInputChange}
            onSubmitEditing={showPrivateKey}
            _input={{
              selectionColor: COLORS.primary,
              cursorColor: COLORS.primary
            }}
          />
          {error && (
            <Text fontSize="sm" color="red.400">
              {error}
            </Text>
          )}
        </VStack>
      )}

      <HStack
        alignItems="center"
        w="full"
        borderWidth="1"
        borderColor="red.400"
        borderRadius={10}
        p="4"
        bgColor="red.100"
      >
        <Icon
          as={<Ionicons name="eye-off" />}
          size={1.3 * FONT_SIZE['xl']}
          color="red.400"
        />
        <Text fontSize={FONT_SIZE['md']} mx="4">
          Never disclose this key. Anyone with your private key can fully
          control your account, including transferring away any of your funds.
        </Text>
      </HStack>

      {privateKey ? (
        <Button text="Done" onPress={handleOnClose} />
      ) : (
        <HStack w="full" alignItems="center" justifyContent="space-between">
          <RNButton
            py="4"
            bgColor="red.100"
            w="50%"
            onPress={handleOnClose}
            _pressed={{ backgroundColor: 'red.200' }}
          >
            <Text color="red.400" bold fontSize="md">
              Cancel
            </Text>
          </RNButton>
          <Button
            text="Reveal"
            onPress={showPrivateKey}
            style={{ width: '50%', borderRadius: 0 }}
          />
        </HStack>
      )}
    </VStack>
  );
}
