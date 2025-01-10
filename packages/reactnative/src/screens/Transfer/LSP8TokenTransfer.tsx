import {
  useIsFocused,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { Divider, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import Button from '../../components/Button';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import LSP8DigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { ethers, toBigInt, TransactionReceipt } from 'ethers';
import { useModal } from 'react-native-modalfy';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { GasCost } from '../../components/modals/SignTransactionModal';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import useTokenBalance from '../../hooks/useTokenBalance';
import { Controller } from '../../hooks/useWallet';
import { addRecipient } from '../../store/reducers/Recipients';
import { DUMMY_ADDRESS } from '../../utils/constants';
import Header from './modules/Header';
import PastRecipients from './modules/PastRecipients';
import Recipient from './modules/Recipient';
import Sender from './modules/Sender';

type Props = {};

export default function LSP8TokenTransfer({}: Props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();

  const dispatch = useDispatch();

  // @ts-ignore
  const { tokenAddress, metadata } = route.params;

  const { openModal } = useModal();
  const toast = useToast();

  const account = useAccount();
  const network = useNetwork();

  const [controller, setController] = useState<string>();

  const { balance } = useTokenBalance({
    tokenAddress,
    type: 'LSP8'
  });

  const { balance: controllerBalance } = useBalance({
    address: controller || account.address
  });
  const [gasCost, setGasCost] = useState<GasCost>({
    min: null,
    max: null
  });

  const [recipient, setRecipient] = useState('');

  const { getItem } = useSecureStorage();

  const estimateGasCost = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(network.provider);
      const controller: Controller = (await getItem(
        'controller'
      )) as Controller;
      const controllerWallet = new ethers.Wallet(controller.privateKey).connect(
        provider
      );

      const universalProfile = new ethers.Contract(
        account.address,
        UniversalProfileContract.abi,
        controllerWallet
      );

      const keyManager = new ethers.Contract(
        account.keyManager,
        KeyManagerContract.abi,
        controllerWallet
      );

      const lsp8Token = new ethers.Contract(
        tokenAddress, // Address of the LSP8 token contract
        LSP8DigitalAssetContract.abi, // ABI of the LSP8 token contract
        controllerWallet
      );

      const tokenId = ethers.zeroPadValue(ethers.toBeHex(1), 32); // Replace '1' with your tokenId

      const transferData = lsp8Token.interface.encodeFunctionData('transfer', [
        account.address, // From address (Universal Profile address)
        DUMMY_ADDRESS, // To address
        tokenId, // Unique token ID to transfer
        true, // Whether the recipient must notify (true/false)
        '0x' // Additional data (can be empty)
      ]);

      const executeData = universalProfile.interface.encodeFunctionData(
        'execute',
        [
          0, // Operation type (0 for call)
          tokenAddress, // LSP8 token contract address
          0, // Value in LYX (should be 0 for token transfer)
          transferData // Encoded LSP8 transfer call
        ]
      );

      // Call execute on Key Manager
      const gasEstimate = await keyManager.execute.estimateGas(executeData, {
        gasLimit: 1000000
      });

      const feeData = await provider.getFeeData();

      const gasCost: GasCost = {
        min: null,
        max: null
      };

      if (feeData.gasPrice) {
        gasCost.min = toBigInt(gasEstimate) * feeData.gasPrice;
      }

      if (feeData.maxFeePerGas) {
        gasCost.max = toBigInt(gasEstimate) * feeData.maxFeePerGas;
      }

      setGasCost(gasCost);
    } catch (error) {
      toast.show('Transaction might fail', { type: 'danger' });
      console.error(error);
    }
  };

  const transfer = async (): Promise<TransactionReceipt | undefined> => {
    const provider = new ethers.JsonRpcProvider(network.provider);
    const controller: Controller = (await getItem('controller')) as Controller;
    const controllerWallet = new ethers.Wallet(controller.privateKey).connect(
      provider
    );

    const universalProfile = new ethers.Contract(
      account.address,
      UniversalProfileContract.abi,
      controllerWallet
    );

    const keyManager = new ethers.Contract(
      account.keyManager,
      KeyManagerContract.abi,
      controllerWallet
    );

    const lsp8Token = new ethers.Contract(
      tokenAddress, // Address of the LSP8 token contract
      LSP8DigitalAssetContract.abi, // ABI of the LSP8 token contract
      controllerWallet
    );

    const transferData = lsp8Token.interface.encodeFunctionData('transfer', [
      account.address, // From address (Universal Profile address)
      recipient, // To address
      1, // Unique token ID to transfer
      true, // Whether the recipient must notify (true/false)
      '0x' // Additional data (can be empty)
    ]);

    const executeData = universalProfile.interface.encodeFunctionData(
      'execute',
      [
        0, // Operation type (0 for call)
        tokenAddress, // LSP8 token contract address
        0, // Value in LYX (should be 0 for token transfer)
        transferData // Encoded LSP8 transfer call
      ]
    );

    // Call execute on Key Manager
    const tx = await keyManager.execute(executeData, { gasLimit: 1000000 });

    const txReceipt = await tx.wait(1);

    dispatch(addRecipient(recipient));

    return txReceipt;
  };

  const confirm = () => {
    if (!ethers.isAddress(recipient)) {
      toast.show('Invalid address', {
        type: 'danger'
      });
      return;
    }

    openModal('TransferConfirmationModal', {
      txData: {
        from: account,
        to: recipient,
        balance: balance
      },
      estimateGasCost: gasCost.min,
      token: metadata.symbol,
      onTransfer: transfer
    });
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.goBack();

    return true;
  });

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      const controller = (await getItem('controller')) as Controller;
      setController(controller.address);
    })();
    const provider = new ethers.JsonRpcProvider(network.provider);

    provider.off('block');

    estimateGasCost();

    provider.on('block', blockNumber => {
      estimateGasCost();
    });

    return () => {
      provider.off('block');
      backHandler.remove();
    };
  }, []);

  if (!isFocused) return;

  return (
    <VStack flex="1" bgColor="white" p="15" space="6">
      <Header token={metadata ? metadata.symbol : ''} />

      <Sender
        balance={
          balance !== null ? `${balance.toString()} ${metadata?.symbol}` : null
        }
      />

      <Recipient
        recipient={recipient}
        onChange={setRecipient}
        onSubmit={confirm}
      />

      <Divider bgColor="muted.300" my="2" />

      <PastRecipients onSelect={setRecipient} />

      <Button text="Next" onPress={confirm} />
    </VStack>
  );
}
