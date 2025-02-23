import {
  HStack,
  Button as RNButton,
  ScrollView,
  Text,
  VStack
} from 'native-base';
import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { parseBalance } from '../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/styles';
import Blockie from '../Blockie';
import Button from '../Button';

type Props = {
  modal: {
    closeModal: (modal?: string, callback?: () => void) => void;
    params: {
      message: any;
      onReject: () => void;
      onConfirm: () => void;
    };
  };
};

export default function SignMessageModal({
  modal: { closeModal, params }
}: Props) {
  const account = useAccount();
  const network = useNetwork();
  const { profile } = useProfile();

  const { balance } = useBalance({ address: account.address });

  const sign = () => {
    closeModal('SignMessageModal', params.onConfirm);
  };

  const reject = () => {
    closeModal();
    params.onReject();
  };

  return (
    <VStack
      bgColor="white"
      borderRadius="30"
      p="5"
      space={4}
      w={WINDOW_WIDTH * 0.9}
    >
      <HStack
        alignItems="center"
        justifyContent="space-between"
        pb={4}
        borderBottomWidth={1}
        borderBottomColor={'muted.200'}
      >
        <HStack alignItems="center" space="2">
          <Blockie address={account.address} size={1.8 * FONT_SIZE['xl']} />

          <VStack>
            <Text fontSize={'md'}>{network.name} network</Text>
            <Text fontSize={'sm'} fontWeight={'medium'}>
              {profile?.name}
            </Text>
          </VStack>
        </HStack>

        <VStack alignItems={'flex-end'}>
          <Text fontSize={'md'}>Balance</Text>
          <Text fontSize={'sm'} fontWeight={'medium'}>
            {balance !== null
              ? `${parseBalance(balance)} ${network.token}`
              : null}
          </Text>
        </VStack>
      </HStack>

      <ScrollView maxH={WINDOW_HEIGHT * 0.5}>
        <VStack alignItems={'center'} p={'2'} space={'4'}>
          <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'}>
            Signature Request
          </Text>

          <Text textAlign={'center'} fontSize={'md'} color={'muted.500'}>
            Only sign this message if you fully understand the content and trust
            this platform
          </Text>

          <Text fontSize={'md'} color={'muted.500'}>
            You are signing:
          </Text>
        </VStack>

        <VStack
          p={'4'}
          space={'2'}
          borderTopWidth={'1'}
          borderBottomWidth={'1'}
          borderColor={'muted.200'}
        >
          <Text fontSize={'xl'} fontWeight={'medium'} color={'muted.500'}>
            Message:
          </Text>

          <Text fontSize={'sm'} color={'muted.500'}>
            {JSON.stringify(params.message)}
          </Text>
        </VStack>
      </ScrollView>

      <HStack w="full" alignItems="center" justifyContent="space-between">
        <RNButton
          py="4"
          bgColor="red.100"
          w="50%"
          onPress={reject}
          _pressed={{ background: 'red.200' }}
        >
          <Text color="red.400" bold fontSize="md">
            Reject
          </Text>
        </RNButton>
        <Button
          text="Sign"
          onPress={sign}
          style={{ width: '50%', borderRadius: 0 }}
        />
      </HStack>
    </VStack>
  );
}
