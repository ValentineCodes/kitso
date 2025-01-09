import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Divider, Image, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import Button from '../../components/Button';
import { FONT_SIZE } from '../../utils/styles';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import { useModal } from 'react-native-modalfy';
import { useToast } from 'react-native-toast-notifications';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { parseBalance, parseFloat } from '../../utils/helperFunctions';
import Amount from './modules/Amount';
import Header from './modules/Header';
import PastRecipients from './modules/PastRecipients';
import Recipient from './modules/Recipient';
import Sender from './modules/Sender';

type Props = {};

export default function NetworkTokenTransfer({}: Props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { openModal } = useModal();
  const toast = useToast();

  const account = useAccount();
  const network = useNetwork();

  const { balance } = useBalance({
    address: account.address
  });

  const [gasCost, setGasCost] = useState<bigint | null>(null);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const getGasCost = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(network.provider);
      const gasPrice = (await provider.getFeeData()).gasPrice;

      const gasCost = (gasPrice || 0n) * 21000n;

      setGasCost(gasCost);
    } catch (error) {
      return;
    }
  };

  const confirm = () => {
    if (!ethers.isAddress(recipient)) {
      toast.show('Invalid address', {
        type: 'danger'
      });
      return;
    }

    let _amount = Number(amount);

    if (isNaN(_amount) || _amount < 0) {
      toast.show('Invalid amount', {
        type: 'danger'
      });
      return;
    }

    if (amount.trim() && balance && gasCost && !isNaN(_amount)) {
      if (_amount >= Number(ethers.formatEther(balance))) {
        toast.show('Insufficient amount', {
          type: 'danger'
        });
        return;
      } else if (Number(ethers.formatEther(balance - gasCost)) < _amount) {
        toast.show('Insufficient amount for gas', {
          type: 'danger'
        });
        return;
      }
    }

    openModal('TransferConfirmationModal', {
      txData: {
        from: account,
        to: recipient,
        amount: parseFloat(amount, 8),
        balance: balance
      },
      estimateGasCost: gasCost,
      token: network.token
    });
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.goBack();

    return true;
  });

  useEffect(() => {
    if (!isFocused) return;
    const provider = new ethers.JsonRpcProvider(network.provider);

    provider.off('block');

    getGasCost();

    provider.on('block', blockNumber => {
      getGasCost();
    });

    return () => {
      provider.off('block');
      backHandler.remove();
    };
  }, []);

  if (!isFocused) return;

  return (
    <VStack flex="1" bgColor="white" p="15" space="6">
      <Header token={network.token} />

      <Sender
        balance={
          balance !== null ? `${parseBalance(balance)} ${network.token}` : null
        }
      />

      <Recipient
        recipient={recipient}
        onChange={setRecipient}
        onSubmit={confirm}
      />

      <Amount
        amount={amount}
        token={network.token}
        balance={balance}
        gasCost={gasCost}
        onChange={setAmount}
        onConfirm={confirm}
        tokenImage={
          <Image
            key={require('../../../assets/images/lukso_logo.png')}
            source={require('../../../assets/images/lukso_logo.png')}
            alt={network.name}
            width={2 * FONT_SIZE['lg']}
            height={2 * FONT_SIZE['lg']}
            ml={2}
          />
        }
      />

      <Divider bgColor="muted.300" my="2" />

      <PastRecipients onSelect={setRecipient} />

      <Button text="Next" onPress={confirm} />
    </VStack>
  );
}
