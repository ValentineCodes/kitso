import { Divider, HStack, Button as RNButton, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Blockie from '../../components/Blockie';
import { Account } from '../../store/reducers/Accounts';
import { parseFloat, truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers, toBigInt } from 'ethers';
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { Address } from 'viem';
import Button from '../../components/Button';
import { useProfile } from '../../context/ProfileContext';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { Controller } from '../../hooks/useWallet';
import { addRecipient } from '../../store/reducers/Recipients';
import Fail from './modules/Fail';
import Success from './modules/Success';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      from: Account;
      to: Address;
      value: bigint;
    };
  };
};

interface GasCost {
  min: bigint | null;
  max: bigint | null;
}

export default function SignTransferModal({
  modal: { closeModal, params }
}: Props) {
  const { from, to, value } = params;

  const dispatch = useDispatch();

  const toast = useToast();

  const { getItem } = useSecureStorage();

  const network = useNetwork();
  const account = useAccount();
  const { profile } = useProfile();

  const { balance } = useBalance({ address: from.address });

  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [txReceipt, setTxReceipt] = useState<ethers.TransactionReceipt | null>(
    null
  );
  const [estimatedGasCost, setEstimatedGasCost] = useState<GasCost>({
    min: null,
    max: null
  });

  const calcTotal = () => {
    const minAmount =
      estimatedGasCost.min &&
      parseFloat(
        ethers.formatEther(value + estimatedGasCost.min),
        8
      ).toString();
    const maxAmount =
      estimatedGasCost.max &&
      parseFloat(
        ethers.formatEther(value + estimatedGasCost.max),
        8
      ).toString();
    return {
      min: String(minAmount),
      max: String(maxAmount)
    };
  };

  const transfer = async () => {
    const provider = new ethers.JsonRpcProvider(network.provider);

    const controller = (await getItem('controller')) as Controller;

    const wallet = new ethers.Wallet(controller.privateKey).connect(provider);
    try {
      setIsTransferring(true);

      const tx = await wallet.sendTransaction({
        from: from.address,
        to: to,
        value: ethers.parseEther(value.toString())
      });

      const txReceipt = await tx.wait(1);

      setTxReceipt(txReceipt);
      setShowSuccessModal(true);

      dispatch(addRecipient(to));
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

  const estimateGasCost = async () => {
    const provider = new ethers.JsonRpcProvider(network.provider);

    const gasPrice = (await provider.getFeeData()).gasPrice;

    const gasEstimate = (gasPrice || toBigInt(0)) * toBigInt(21000);

    const feeData = await provider.getFeeData();

    const gasCost: GasCost = {
      min: null,
      max: null
    };

    if (feeData.gasPrice) {
      gasCost.min = gasEstimate * feeData.gasPrice;
    }

    if (feeData.maxFeePerGas) {
      gasCost.max = gasEstimate * feeData.maxFeePerGas;
    }

    setEstimatedGasCost(gasCost);
  };

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(network.provider);

    provider.off('block');

    provider.on('block', blockNumber => estimateGasCost());

    return () => {
      provider.off('block');
    };
  }, []);

  return (
    <>
      <VStack
        bgColor="white"
        borderRadius="30"
        p="5"
        space={4}
        w={WINDOW_WIDTH * 0.9}
      >
        <VStack space="2">
          <Text textAlign={'right'} fontSize={'md'} fontWeight={'medium'}>
            {network.name} network
          </Text>
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
              <Blockie address={account.address} size={1.8 * FONT_SIZE['xl']} />

              <VStack w="75%">
                <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">
                  {profile?.name}
                </Text>
                <Text fontSize={FONT_SIZE['md']}>
                  Balance: {balance && `${balance} ${network.token}`}
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
            <Blockie address={to} size={1.8 * FONT_SIZE['xl']} />
            <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">
              {truncateAddress(to)}
            </Text>
          </HStack>
        </VStack>

        <Text fontSize={2 * FONT_SIZE['xl']} bold textAlign="center">
          {ethers.formatEther(value)} {network.token}
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

            <VStack w="50%">
              <Text
                fontSize={FONT_SIZE['lg']}
                fontWeight="medium"
                textAlign="right"
              >
                {String(
                  estimatedGasCost.min &&
                    parseFloat(ethers.formatEther(estimatedGasCost.min), 8)
                )}{' '}
                {network.token}
              </Text>
              <Text
                fontSize={FONT_SIZE['md']}
                fontWeight={'semibold'}
                textAlign="right"
                color={'muted.500'}
              >
                Max fee:
              </Text>
              <Text fontSize={FONT_SIZE['md']} textAlign="right">
                {String(
                  estimatedGasCost.max &&
                    parseFloat(ethers.formatEther(estimatedGasCost.max), 8)
                )}{' '}
                {network.token}
              </Text>
            </VStack>
          </HStack>

          <Divider bgColor="muted.100" />

          <HStack p="3" alignItems="flex-start" justifyContent="space-between">
            <VStack>
              <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
                Total:
              </Text>
              <Text fontSize={FONT_SIZE['sm']} color="green.500">
                Amount + gas fee
              </Text>
            </VStack>

            <VStack w="50%">
              <Text
                fontSize={FONT_SIZE['lg']}
                fontWeight="medium"
                textAlign="right"
              >
                {calcTotal().min} {network.token}
              </Text>
              <Text
                fontSize={FONT_SIZE['md']}
                fontWeight={'semibold'}
                textAlign="right"
                color={'muted.500'}
              >
                Max amount:
              </Text>
              <Text fontSize={FONT_SIZE['md']} textAlign="right">
                {calcTotal().max} {network.token}
              </Text>
            </VStack>
          </HStack>
        </VStack>

        <HStack w="full" alignItems="center" justifyContent="space-between">
          <RNButton
            py="4"
            bgColor="red.100"
            w="50%"
            onPress={() => closeModal}
            _pressed={{ background: 'red.200' }}
          >
            <Text color="red.400" bold fontSize="md">
              Reject
            </Text>
          </RNButton>
          <Button
            text="Confirm"
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
    </>
  );
}
