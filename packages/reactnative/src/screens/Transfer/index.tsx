import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  Divider,
  FlatList,
  HStack,
  Icon,
  Image,
  Input,
  Pressable,
  Text,
  View,
  VStack
} from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, TouchableOpacity } from 'react-native';
// @ts-ignore
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
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
import QRCodeScanner from '../../components/modals/QRCodeScanner';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import { useCryptoPrice } from '../../hooks/scaffold-eth/useCryptoPrice';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { clearRecipients } from '../../store/reducers/Recipients';
import {
  isENS,
  parseFloat,
  truncateAddress
} from '../../utils/helperFunctions';
import ConfirmationModal from './modules/ConfirmationModal';

type Props = {};

export default function Transfer({}: Props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  const { openModal } = useModal();

  const toast = useToast();

  const account = useAccount();
  const network = useNetwork();

  const recipients: string[] = useSelector((state: any) => state.recipients);

  const [balance, setBalance] = useState<bigint | null>(null);
  const [gasCost, setGasCost] = useState<bigint | null>(null);

  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [toAddressError, setToAddressError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isAmountInCrypto, setIsAmountInCrypto] = useState(true);

  const { price } = useCryptoPrice({ enabled: false });

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

  const getAmountConversion = useCallback(() => {
    if (price === null || isNaN(Number(amount))) return;

    if (isAmountInCrypto) {
      const dollarValue = Number(amount) * price;
      return '$' + (dollarValue ? parseFloat(dollarValue.toString(), 8) : '0');
    } else {
      const dollarValue = Number(amount) / price;
      return `${dollarValue ? parseFloat(dollarValue.toString(), 8) : '0'} ${network.token}`;
    }
  }, [price, amount, isAmountInCrypto]);

  const confirm = () => {
    if (!ethers.isAddress(toAddress)) {
      toast.show('Invalid address', {
        type: 'danger'
      });
      return;
    }

    let _amount = amount;

    if (!isAmountInCrypto) {
      if (price) {
        _amount = (Number(_amount) / price).toString();
      } else if (amountError) {
        setAmountError('');
      }
    }

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

  const formatBalance = () => {
    return Number(ethers.formatEther(balance!))
      ? parseFloat(Number(ethers.formatEther(balance!)).toString(), 4)
      : 0;
  };

  const handleToAddressChange = async (value: string) => {
    setToAddress(value);

    if (toAddressError) {
      setToAddressError('');
    }

    if (isENS(value)) {
      try {
        const provider = new ethers.JsonRpcProvider(
          `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`
        );

        const address = await provider.resolveName(value);

        if (address && ethers.isAddress(address)) {
          setToAddress(address);
        } else {
          setToAddressError('Invalid ENS');
        }
      } catch (error) {
        setToAddressError('Could not resolve ENS');
        return;
      }
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);

    let amount = Number(value);

    if (!isAmountInCrypto) {
      if (price) {
        amount = Number(amount) / price;
      } else if (amountError) {
        setAmountError('');
      }
    }

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

  const setMaxAmount = () => {
    if (balance && gasCost && balance > gasCost) {
      const max = ethers.formatEther(balance - gasCost);
      handleAmountChange(max);
      setIsAmountInCrypto(true);
    }
  };

  const convertCurrency = () => {
    // allow users to start from preferred currency
    if (!amount && price) {
      setIsAmountInCrypto(!isAmountInCrypto);
      return;
    }

    // validate input
    if (!amount || !price) return;
    if (isNaN(Number(amount)) || Number(amount) < 0) {
      toast.show('Invalid amount', {
        type: 'danger'
      });
      return;
    }

    setIsAmountInCrypto(!isAmountInCrypto);

    if (isAmountInCrypto) {
      setAmount((Number(amount) * price).toString());
    } else {
      setAmount((Number(amount) / price).toString());
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
      <HStack alignItems="center" space={2}>
        <Pressable
          onPress={() => navigation.goBack()}
          _pressed={{ opacity: 0.4 }}
        >
          <Icon
            as={<Ionicons name="arrow-back-outline" />}
            size={1.3 * FONT_SIZE['xl']}
            color="black"
          />
        </Pressable>
        <Text fontSize={1.2 * FONT_SIZE['lg']} bold>
          Send {network.token}
        </Text>
      </HStack>

      <VStack space="2">
        <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
          From:
        </Text>

        <View style={styles.fromAccountContainer} bgColor={'#f5f5f5'}>
          <HStack alignItems="center" space="2">
            <Blockie address={account.address} size={1.8 * FONT_SIZE['xl']} />

            <VStack w="75%">
              <Text fontSize={FONT_SIZE['md']} fontWeight="medium">
                {truncateAddress(account.address)}
              </Text>
              <Text fontSize={FONT_SIZE['sm']}>
                Balance:{' '}
                {balance !== null && `${formatBalance()} ${network.token}`}
              </Text>
            </VStack>
          </HStack>
        </View>
      </VStack>

      <VStack space="2">
        <HStack alignItems="center" space="2">
          <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
            To:
          </Text>
          <TouchableOpacity
            activeOpacity={0.4}
            style={{ width: '100%' }}
            onPress={() => {
              // if (accounts.length > 1) {
              //     setShowToAccountsModal(true)
              // } else {
              setToAddress(account.address);
              // }
            }}
          >
            {/* <Text color={COLORS.primary} fontWeight="medium" fontSize={FONT_SIZE['lg']} flex="1">My account<Text color="black">{getToAddressName()}</Text></Text> */}
          </TouchableOpacity>
        </HStack>

        <Input
          value={toAddress}
          borderRadius="lg"
          variant="filled"
          fontSize="md"
          focusOutlineColor={COLORS.primary}
          InputLeftElement={
            ethers.isAddress(toAddress) ? (
              <View ml="2">
                <Blockie address={toAddress} size={1.8 * FONT_SIZE['xl']} />
              </View>
            ) : undefined
          }
          InputRightElement={
            <TouchableOpacity
              onPress={() => setShowScanner(true)}
              style={{ marginRight: 10 }}
            >
              <Icon
                as={<MaterialCommunityIcons name="qrcode-scan" />}
                size={1.3 * FONT_SIZE['xl']}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          }
          placeholder="Recipient Address"
          onChangeText={handleToAddressChange}
          _input={{
            selectionColor: COLORS.primary,
            cursorColor: COLORS.primary
          }}
          onSubmitEditing={confirm}
        />

        {toAddressError && (
          <Text fontSize={FONT_SIZE['md']} color="red.400">
            {toAddressError}
          </Text>
        )}
      </VStack>

      <VStack space="2">
        <HStack alignItems="center" space="2">
          <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">
            Amount:
          </Text>
          {balance && gasCost && balance >= gasCost && (
            <TouchableOpacity activeOpacity={0.4} onPress={setMaxAmount}>
              <Text
                color={COLORS.primary}
                fontWeight="medium"
                fontSize={FONT_SIZE['lg']}
              >
                Max
              </Text>
            </TouchableOpacity>
          )}
        </HStack>

        <Input
          value={amount}
          borderRadius="lg"
          variant="filled"
          fontSize="lg"
          focusOutlineColor={COLORS.primary}
          placeholder={`0 ${isAmountInCrypto ? network.token : 'USD'}`}
          onChangeText={handleAmountChange}
          _input={{
            selectionColor: COLORS.primary,
            cursorColor: COLORS.primary
          }}
          onSubmitEditing={confirm}
          keyboardType="number-pad"
          InputLeftElement={
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={convertCurrency}
              disabled={!Boolean(price)}
              style={{ marginLeft: 10 }}
            >
              {isAmountInCrypto ? (
                <Image
                  key={require('../../../assets/images/lukso_logo.png')}
                  source={require('../../../assets/images/lukso_logo.png')}
                  alt={network.name}
                  style={styles.networkLogo}
                />
              ) : (
                <Icon
                  as={<FontAwesome5 name="dollar-sign" />}
                  size={1.3 * FONT_SIZE['xl']}
                  ml={3}
                  color={COLORS.primary}
                />
              )}
            </TouchableOpacity>
          }
          InputRightElement={
            price !== null ? (
              <Text fontSize={FONT_SIZE['lg']} color={COLORS.primary} mr="2">
                {getAmountConversion()}
              </Text>
            ) : undefined
          }
        />

        {amountError && (
          <Text fontSize={FONT_SIZE['md']} color="red.400">
            {amountError}
          </Text>
        )}
      </VStack>

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
                  onPress={() => setToAddress(item)}
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

      {showScanner && (
        <QRCodeScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onReadCode={address => {
            setToAddress(address);
            setShowScanner(false);
          }}
        />
      )}

      <Button text="Next" onPress={confirm} />

      {showConfirmationModal && (
        <ConfirmationModal
          isVisible={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          txData={{
            from: account,
            to: toAddress,
            amount:
              !isAmountInCrypto && price
                ? parseFloat((Number(amount) / price).toString(), 8)
                : parseFloat(amount, 8),
            fromBalance: balance
          }}
          estimateGasCost={gasCost}
        />
      )}
    </VStack>
  );
}

const styles = StyleSheet.create({
  fromAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  networkLogo: {
    width: 2 * FONT_SIZE['xl'],
    height: 2 * FONT_SIZE['xl']
  }
});
