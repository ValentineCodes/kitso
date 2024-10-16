import {
  Divider,
  ScrollView,
  Text,
  View
} from 'native-base';
import React, {useState, useEffect, useRef} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {useNavigation} from '@react-navigation/native';
import SInfo from 'react-native-sensitive-info';
import {useToast} from 'react-native-toast-notifications';
import {createWallet} from 'react-native-web3-wallet';

import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader';
import {COLORS, STORAGE_KEY} from '../../../utils/constants';
import {FONT_SIZE} from '../../../utils/styles';
import Button from '../../../components/Button';
import SeedPhrase from '../../../components/SeedPhrase';

interface Wallet {
  mnemonic: string;
  privateKey: string;
  address: string;
}

type Props = {};

export default function CreateController({}: Props) {
  const navigation = useNavigation();

  const toast = useToast();

  const [wallet, setWallet] = useState<Wallet>();
  const isSeedPhraseRevealed = useRef(false)
  const [isLoading, setIsLoading] = useState(true);

  const copySeedPhrase = () => {
    if (!wallet) {
      toast.show('Still generating wallet');
      return;
    }

    Clipboard.setString(wallet.mnemonic);
    toast.show('Copied to clipboard', {
      type: 'success',
    });
  };

  const saveWallet = async () => {
    if (!wallet || !isSeedPhraseRevealed.current) {
      toast.show('Psst!.. Copy your seed phrase before proceeding', {
        type: 'warning',
      });
      return;
    }
    try {
      // store mnemonic in secure storage
      await SInfo.setItem('mnemonic', wallet.mnemonic, STORAGE_KEY);

      const controller = {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };

      // store controller account in secure and redux storage
      await SInfo.setItem(
        'controller',
        JSON.stringify(controller),
        STORAGE_KEY,
      );

      // @ts-ignore
      navigation.navigate('CreateProfile');
    } catch (error) {
      return;
    }
  };

  const generateNewWallet = () => {
    setTimeout(async () => {
      const newWallet = await createWallet('', undefined, undefined, true);
      const wallet = {
        mnemonic: newWallet.mnemonic.join(' '),
        address: newWallet.address,
        privateKey: newWallet.privateKey,
      };

      // @ts-ignore
      setWallet(wallet);
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    generateNewWallet();
  }, []);

  return (
    <View style={styles.container}>
      <ProgressIndicatorHeader progress={2} steps={4} />

      <Divider bgColor="muted.100" mt="8" mb="4" />

      <ScrollView flex="1">
        <Text
          textAlign="center"
          color={COLORS.primary}
          fontSize={1.7 * FONT_SIZE['xl']}
          lineHeight="40"
          bold>
          Write Down Your Seed Phrase
        </Text>
        <Text textAlign="center" fontSize={FONT_SIZE['lg']} my="2">
          This is your controller seed phrase. Write it down on a piece of paper
          and keep it in a safe place
        </Text>

        <Divider bgColor="muted.100" my="4" />

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <SeedPhrase mnemonic={wallet?.mnemonic} onReveal={() => {
            isSeedPhraseRevealed.current = true
          }} />
        )}

        <Divider bgColor="muted.100" my="4" />

        <Button
          type="outline"
          text="Copy To Clipboard"
          disabled={isLoading}
          onPress={copySeedPhrase}
        />
        <Button
          text="Next"
          disabled={isLoading}
          onPress={saveWallet}
          style={{marginBottom: 50, marginTop: 20}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  loader: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
