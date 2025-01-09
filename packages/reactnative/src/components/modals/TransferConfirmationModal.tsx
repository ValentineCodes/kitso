import {
  Divider,
  HStack,
  Button as RNButton,
  Text,
  View,
  VStack
} from 'native-base';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { ethers } from 'ethers';
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import Button from '../../components/Button';
import Fail from '../../components/modals/modules/Fail';
import Success from '../../components/modals/modules/Success';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { Controller } from '../../hooks/useWallet';
import { Profile } from '../../store/reducers/Profiles';
import { addRecipient } from '../../store/reducers/Recipients';

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
      onConfirm: () => void;
    };
  };
};

export default function TransferConfirmationModal({
  modal: { closeModal, params }
}: Props) {
  const dispatch = useDispatch();

  const toast = useToast();

  const account = useAccount();
  const network = useNetwork();

  const { getItem } = useSecureStorage();

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
    const provider = new ethers.JsonRpcProvider(network.provider);
    const controller: Controller = (await getItem('controller')) as Controller;
    const controllerWallet = new ethers.Wallet(controller.privateKey).connect(
      provider
    );

    const universalProfile = new ethers.Contract(
      params.txData.from.address,
      UniversalProfileContract.abi,
      controllerWallet
    );

    const keyManager = new ethers.Contract(
      account.keyManager,
      KeyManagerContract.abi,
      controllerWallet
    );

    try {
      setIsTransferring(true);

      const executeData = universalProfile.interface.encodeFunctionData(
        'execute',
        [
          0, // Operation type (0 for call)
          params.txData.to, // Target contract address
          ethers.parseEther(params.txData.amount.toString()), // Value in LYX
          '0x' // Encoded setData call
        ]
      );

      // Call execute on Key Manager
      const tx = await keyManager.execute(executeData, { gasLimit: 1000000 });

      const txReceipt = await tx.wait(1);

      setTxReceipt(txReceipt);
      setShowSuccessModal(true);

      dispatch(addRecipient(params.txData.to));
    } catch (error) {
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
