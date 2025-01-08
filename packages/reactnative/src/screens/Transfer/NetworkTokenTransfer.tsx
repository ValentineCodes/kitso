import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  Divider,
  FlatList,
  HStack,
  Image,
  Text,
  View,
  VStack
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { BackHandler, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Blockie from '../../components/Blockie';
import Button from '../../components/Button';
import { ALCHEMY_KEY, COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers, toBigInt } from 'ethers';
import { useModal } from 'react-native-modalfy';
import { useToast } from 'react-native-toast-notifications';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { clearRecipients } from '../../store/reducers/Recipients';
import {
  isENS,
  parseFloat,
  truncateAddress
} from '../../utils/helperFunctions';
import Amount from './modules/Amount';
import ConfirmationModal from './modules/ConfirmationModal';
import Header from './modules/Header';
import Recipient from './modules/Recipient';
import Sender from './modules/Sender';

type Props = {};

export default function NetworkTokenTransfer({}: Props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  const { openModal } = useModal();

  const toast = useToast();

  const account = useAccount();
  const network = useNetwork();

  const { balance: accountBalance } = useBalance({
    address: account.address
  });

  const recipients: string[] = useSelector((state: any) => state.recipients);

  const [balance, setBalance] = useState<bigint | null>(null);
  const [gasCost, setGasCost] = useState<bigint | null>(null);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [recipientError, setRecipientError] = useState('');
  const [amountError, setAmountError] = useState('');

  const getBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(network.provider);
      const balance = await provider.getBalance(account.address);
      const gasPrice = (await provider.getFeeData()).gasPrice;

      const gasCost = (gasPrice || toBigInt(0)) * toBigInt(21000);

      setGasCost(gasCost);
      setBalance(balance);
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

    let _amount = amount;

    if (isNaN(Number(_amount)) || Number(_amount) < 0) {
      toast.show('Invalid amount', {
        type: 'danger'
      });
      return;
    }

    if (_amount.trim() && balance && gasCost && !isNaN(Number(_amount))) {
      if (Number(_amount) >= Number(ethers.formatEther(balance))) {
        toast.show('Insufficient amount', {
          type: 'danger'
        });
        return;
      } else if (
        Number(ethers.formatEther(balance - gasCost)) < Number(_amount)
      ) {
        toast.show('Insufficient amount for gas', {
          type: 'danger'
        });
        return;
      }
    }

    setShowConfirmationModal(true);
  };

  const handleRecipientChange = async (value: string) => {
    setRecipient(value);

    if (recipientError) {
      setRecipientError('');
    }

    if (isENS(value)) {
      try {
        const provider = new ethers.JsonRpcProvider(
          `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`
        );

        const address = await provider.resolveName(value);

        if (address && ethers.isAddress(address)) {
          setRecipient(address);
        } else {
          setRecipientError('Invalid ENS');
        }
      } catch (error) {
        setRecipientError('Could not resolve ENS');
        return;
      }
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);

    let amount = Number(value);

    if (value.trim() && balance && !isNaN(amount) && gasCost) {
      if (amount >= Number(ethers.formatEther(balance))) {
        setAmountError('Insufficient amount');
      } else if (Number(ethers.formatEther(balance - gasCost)) < amount) {
        setAmountError('Insufficient amount for gas');
      } else if (amountError) {
        setAmountError('');
      }
    } else if (amountError) {
      setAmountError('');
    }
  };

  const seekConsentToClearRecipients = () => {
    openModal('ConsentModal', {
      title: 'Clear Recents!',
      subTitle:
        'This action cannot be reversed. Are you sure you want to go through with this?',
      okText: "Yes, I'm sure",
      cancelText: 'Not really',
      onAccept: () => {
        dispatch(clearRecipients());
      }
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

    provider.on('block', blockNumber => {
      getBalance();
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
        balance={accountBalance && `${accountBalance} ${network.token}`}
      />

      <Recipient
        recipient={recipient}
        error={recipientError}
        onChange={handleRecipientChange}
        onSubmit={confirm}
      />

      <Amount
        amount={amount}
        error={amountError}
        token={network.token}
        onChange={handleAmountChange}
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

      <View flex="1">
        {recipients.length > 0 && (
          <>
            <HStack alignItems="center" justifyContent="space-between" mb="4">
              <Text bold fontSize={FONT_SIZE['xl']}>
                Recents
              </Text>
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={seekConsentToClearRecipients}
              >
                <Text
                  color={COLORS.primary}
                  fontSize={FONT_SIZE['lg']}
                  fontWeight="medium"
                >
                  Clear
                </Text>
              </TouchableOpacity>
            </HStack>

            <FlatList
              keyExtractor={item => item}
              data={recipients}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.4}
                  onPress={() => setRecipient(item)}
                >
                  <HStack alignItems="center" space="4" mb="4">
                    <Blockie address={item} size={1.7 * FONT_SIZE['xl']} />
                    <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">
                      {truncateAddress(item)}
                    </Text>
                  </HStack>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </View>

      <Button text="Next" onPress={confirm} />

      {showConfirmationModal && (
        <ConfirmationModal
          isVisible={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          txData={{
            from: account,
            to: recipient,
            amount: parseFloat(amount, 8),
            fromBalance: balance
          }}
          estimateGasCost={gasCost}
        />
      )}
    </VStack>
  );
}