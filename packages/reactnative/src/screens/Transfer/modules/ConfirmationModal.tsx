import { Divider, HStack, Button as RNButton, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import Blockie from '../../../components/Blockie';
import { parseFloat, truncateAddress } from '../../../utils/helperFunctions';
import { FONT_SIZE } from '../../../utils/styles';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { Network } from '../../../store/reducers/Networks';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { BigNumber, ethers } from 'ethers';
import { Linking } from 'react-native';
import SInfo from 'react-native-sensitive-info';
import { useToast } from 'react-native-toast-notifications';
import Button from '../../../components/Button';
import Fail from '../../../components/modals/modules/Fail';
import Success from '../../../components/modals/modules/Success';
import useAccount from '../../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../../hooks/scaffold-eth/useNetwork';
import { Controller } from '../../../hooks/useWallet';
import { Profile } from '../../../store/reducers/Profiles';
import { addRecipient } from '../../../store/reducers/Recipients';
import { STORAGE_KEY } from '../../../utils/constants';

interface TxData {
  from: Profile;
  to: string;
  amount: number;
  fromBalance: BigNumber | null;
}
type Props = {
  isVisible: boolean;
  onClose: () => void;
  txData: TxData;
  estimateGasCost: BigNumber | null;
};

export default function ConfirmationModal({
  isVisible,
  onClose,
  txData,
  estimateGasCost
}: Props) {
  const dispatch = useDispatch();

  const toast = useToast();

  const account = useAccount();
  const network = useNetwork();

  const connectedNetwork: Network = useSelector((state: any) =>
    state.networks.find((network: Network) => network.isConnected)
  );

  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [txReceipt, setTxReceipt] =
    useState<ethers.providers.TransactionReceipt | null>(null);

  const formatBalance = () => {
    return txData.fromBalance &&
      Number(ethers.utils.formatEther(txData.fromBalance))
      ? parseFloat(
          Number(ethers.utils.formatEther(txData.fromBalance)).toString(),
          4
        )
      : 0;
  };

  const calcTotal = () => {
    return (
      estimateGasCost &&
      parseFloat(
        (
          txData.amount + Number(ethers.utils.formatEther(estimateGasCost))
        ).toString(),
        8
      )
    );
  };

  const transfer = async () => {
    const provider = new ethers.providers.JsonRpcProvider(network.provider);
    const controller: Controller = JSON.parse(
      await SInfo.getItem('controller', STORAGE_KEY)
    );
    const controllerWallet = new ethers.Wallet(controller.privateKey).connect(
      provider
    );

    const universalProfile = new ethers.Contract(
      txData.from.address,
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
          txData.to, // Target contract address
          ethers.utils.parseEther(txData.amount.toString()), // Value in LYX
          '0x' // Encoded setData call
        ]
      );

      // Call execute on Key Manager
      const tx = await keyManager.execute(executeData, { gasLimit: 1000000 });

      const txReceipt = await tx.wait(1);

      setTxReceipt(txReceipt);
      setShowSuccessModal(true);

      dispatch(addRecipient(txData.to));
    } catch (error) {
      setShowFailModal(true);
      return;
    } finally {
      setIsTransferring(false);
    }
  };

  const viewTxDetails = async () => {
    if (!connectedNetwork.blockExplorer || !txReceipt) return;

    try {
      await Linking.openURL(
        `${connectedNetwork.blockExplorer}/tx/${txReceipt.transactionHash}`
      );
    } catch (error) {
      toast.show('Cannot open url', {
        type: 'danger'
      });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="zoomOut"
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
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
                address={txData.from.address}
                size={1.8 * FONT_SIZE['xl']}
              />

              <VStack w="75%">
                {/* <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{txData.from.name}</Text> */}
                <Text fontSize={FONT_SIZE['md']}>
                  Balance: {formatBalance()} {connectedNetwork.token}
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
            <Blockie address={txData.to} size={1.8 * FONT_SIZE['xl']} />
            <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">
              {truncateAddress(txData.to)}
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
          {txData.amount} {connectedNetwork.token}
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
              {estimateGasCost &&
                parseFloat(ethers.utils.formatEther(estimateGasCost), 8)}{' '}
              {connectedNetwork.token}
            </Text>
          </HStack>

          <Divider bgColor="muted.100" />

          <HStack p="3" alignItems="flex-start" justifyContent="space-between">
            <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
              Total
            </Text>
            <Text
              fontSize={FONT_SIZE['lg']}
              fontWeight="medium"
              w="50%"
              textAlign="right"
            >
              {calcTotal()} {connectedNetwork.token}
            </Text>
          </HStack>
        </VStack>

        <HStack w="full" alignItems="center" justifyContent="space-between">
          <RNButton
            py="4"
            bgColor="red.100"
            w="50%"
            onPress={onClose}
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
          onClose();
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
    </Modal>
  );
}
