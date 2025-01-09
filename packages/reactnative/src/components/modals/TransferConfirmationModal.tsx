import {
  Divider,
  HStack,
  Button as RNButton,
  Text,
  View,
  VStack
} from 'native-base';
import React, { useState } from 'react';
import Blockie from '../../components/Blockie';
import {
  parseBalance,
  parseFloat,
  truncateAddress
} from '../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers, TransactionReceipt } from 'ethers';
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import Button from '../../components/Button';
import Fail from '../../components/modals/modules/Fail';
import Success from '../../components/modals/modules/Success';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { Profile } from '../../store/reducers/Profiles';

interface TxData {
  from: Profile;
  to: string;
  amount: number;
  balance: bigint | null;
}
type Props = {
  modal: {
    closeModal: (modal?: string, callback?: () => void) => void;
    params: {
      txData: TxData;
      estimateGasCost: bigint | null;
      token: string;
      isNativeToken: boolean;
      onTransfer: () => Promise<TransactionReceipt | undefined>;
    };
  };
};

export default function TransferConfirmationModal({
  modal: { closeModal, params }
}: Props) {
  const toast = useToast();
  const network = useNetwork();

  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [txReceipt, setTxReceipt] = useState<ethers.TransactionReceipt | null>(
    null
  );

  const calcTotal = () => {
    return String(
      params.estimateGasCost &&
        parseFloat(
          (
            params.txData.amount +
            Number(ethers.formatEther(params.estimateGasCost))
          ).toString(),
          8
        )
    );
  };

  const transfer = async () => {
    try {
      setIsTransferring(true);

      const txReceipt = await params.onTransfer();

      if (!txReceipt) return;

      setTxReceipt(txReceipt);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error)
      setShowFailModal(true);
      return;
    } finally {
      setIsTransferring(false);
    }
  };

  const viewTxDetails = async () => {
    if (!network.blockExplorer || !txReceipt) return;

    try {
      await Linking.openURL(`${network.blockExplorer}/tx/${txReceipt.hash}`);
    } catch (error) {
      toast.show('Cannot open url', {
        type: 'danger'
      });
    }
  };

  return (
    <View bgColor="white" borderRadius="30" w={WINDOW_WIDTH * 0.9}>
      <VStack bgColor="white" borderRadius="30" p="5" space={4}>
        <VStack space="2">
          <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
            From:
          </Text>

          <HStack
            alignItems="center"
            justifyContent="space-between"
            bgColor="#F5F5F5"
            borderRadius="10"
            p="2"
          >
            <HStack alignItems="center" space="2">
              <Blockie
                address={params.txData.from.address}
                size={1.8 * FONT_SIZE['xl']}
              />

              <VStack w="75%">
                {/* <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{params.txData.from.name}</Text> */}
                <Text fontSize={FONT_SIZE['md']}>
                  Balance:{' '}
                  {params.txData.balance !== null
                    ? `${parseBalance(params.txData.balance)} ${params.token}`
                    : null}
                </Text>
              </VStack>
            </HStack>
          </HStack>
        </VStack>

        <VStack space="2">
          <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
            To:
          </Text>

          <HStack
            alignItems="center"
            space="2"
            bgColor="#F5F5F5"
            borderRadius="10"
            p="2"
          >
            <Blockie address={params.txData.to} size={1.8 * FONT_SIZE['xl']} />
            <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">
              {truncateAddress(params.txData.to)}
            </Text>
          </HStack>
        </VStack>

        <Text
          fontSize={FONT_SIZE['lg']}
          fontWeight="medium"
          textAlign="center"
          mb="-4"
        >
          AMOUNT
        </Text>
        <Text fontSize={2 * FONT_SIZE['xl']} bold textAlign="center">
          {params.txData.amount} {params.token}
        </Text>

        <VStack borderWidth="1" borderColor="muted.300" borderRadius="10">
          <HStack p="3" alignItems="flex-start" justifyContent="space-between">
            <VStack>
              <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
                Estimated gas fee
              </Text>
              <Text fontSize={FONT_SIZE['sm']} color="green.500">
                Likely in &lt; 30 second
              </Text>
            </VStack>
            <Text
              fontSize={FONT_SIZE['lg']}
              fontWeight="medium"
              w="50%"
              textAlign="right"
            >
              {String(
                params.estimateGasCost &&
                  parseFloat(ethers.formatEther(params.estimateGasCost), 8)
              )}{' '}
              {network.token}
            </Text>
          </HStack>

          {params.isNativeToken && (
            <>
              <Divider bgColor="muted.100" />

              <HStack
                p="3"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
                  Total
                </Text>
                <Text
                  fontSize={FONT_SIZE['lg']}
                  fontWeight="medium"
                  w="50%"
                  textAlign="right"
                >
                  {calcTotal()} {params.token}
                </Text>
              </HStack>
            </>
          )}
        </VStack>

        <HStack w="full" alignItems="center" justifyContent="space-between">
          <RNButton
            py="4"
            bgColor="red.100"
            w="50%"
            onPress={() => closeModal()}
            _pressed={{ background: 'red.200' }}
          >
            <Text color="red.400" bold fontSize="md">
              Cancel
            </Text>
          </RNButton>
          <Button
            text="Confirm"
            loading={isTransferring}
            onPress={transfer}
            style={{ width: '50%', borderRadius: 0 }}
          />
        </HStack>
      </VStack>

      <Success
        isVisible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          closeModal();
        }}
        onViewDetails={viewTxDetails}
      />

      <Fail
        isVisible={showFailModal}
        onClose={() => setShowFailModal(false)}
        onRetry={() => {
          setShowFailModal(false);
          transfer();
        }}
      />
    </View>
  );
}
