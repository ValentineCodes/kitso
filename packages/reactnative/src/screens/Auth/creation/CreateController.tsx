import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { Divider, ScrollView, Text, View } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import Button from '../../../components/Button';
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader';
import SeedPhrase from '../../../components/SeedPhrase';
import { useSecureStorage } from '../../../hooks/useSecureStorage';
import useWallet from '../../../hooks/useWallet';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';

interface Wallet {
  mnemonic: string;
  privateKey: string;
  address: string;
}

type Props = {};

export default function CreateController({}: Props) {
  const navigation = useNavigation();

  const toast = useToast();

  const { saveItem, getItem } = useSecureStorage();

  const { createWallet } = useWallet();

  const [wallet, setWallet] = useState<Wallet>();
  const isSeedPhraseRevealed = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const copySeedPhrase = () => {
    if (!wallet) {
      toast.show('Still generating wallet');
      return;
    }

    Clipboard.setString(wallet.mnemonic);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  const saveWallet = async () => {
    if (!wallet || !isSeedPhraseRevealed.current) {
      toast.show('Psst!.. Copy your seed phrase before proceeding', {
        type: 'warning'
      });
      return;
    }
    try {
      // store mnemonic in secure storage
      await saveItem('mnemonic', wallet.mnemonic);

      const controller = {
        address: wallet.address,
        privateKey: wallet.privateKey
      };

      // store controller account in secure and redux storage
      await saveItem('controller', controller);

      // @ts-ignore
      navigation.navigate('CreateProfile');
    } catch (error) {
      return;
    }
  };

  const generateNewWallet = () => {
    setTimeout(async () => {
      const wallet = await createWallet();

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
          bold
        >
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
          <SeedPhrase
            mnemonic={wallet?.mnemonic}
            onReveal={() => {
              isSeedPhraseRevealed.current = true;
            }}
          />
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
          style={{ marginBottom: 50, marginTop: 20 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15
  },
  loader: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
