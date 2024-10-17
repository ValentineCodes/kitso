import { useIsFocused } from '@react-navigation/native';
import { HStack, Pressable, Switch, Text, VStack } from 'native-base';
import React, { useLayoutEffect, useState } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useModal } from 'react-native-modalfy';
import SInfo from 'react-native-sensitive-info';
import { useToast } from 'react-native-toast-notifications';
import { COLORS, STORAGE_KEY } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {};

export default function Settings({}: Props) {
  const toast = useToast();
  const { openModal } = useModal();
  const isFocused = useIsFocused();

  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  const toggleBiometrics = async (isBiometricsEnabled: boolean) => {
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      const signInWithBio = async () => {
        let epochTimeSeconds = Math.round(
          new Date().getTime() / 1000
        ).toString();
        let payload = epochTimeSeconds + 'some message';

        try {
          const response = await rnBiometrics.createSignature({
            promptMessage: 'Authenticate',
            payload: payload
          });

          if (response.success) {
            const _security = await SInfo.getItem('security', STORAGE_KEY);

            await SInfo.setItem(
              'security',
              JSON.stringify({ ...JSON.parse(_security), isBiometricsEnabled }),
              STORAGE_KEY
            );

            setIsBiometricsEnabled(isBiometricsEnabled);
          }
        } catch (error) {
          return;
        }
      };

      const { available } = await rnBiometrics.isSensorAvailable();

      if (available) {
        const { keysExist } = await rnBiometrics.biometricKeysExist();

        if (!keysExist) {
          await rnBiometrics.createKeys();
        }

        signInWithBio();
      } else {
        toast.show('Biometrics is not available on this device');
      }
    } catch (error) {
      toast.show('Could not sign in with biometrics', {
        type: 'danger'
      });
    }
  };

  useLayoutEffect(() => {
    (async () => {
      const rnBiometrics = new ReactNativeBiometrics();

      const { available } = await rnBiometrics.isSensorAvailable();

      setIsBiometricsAvailable(available);

      if (available) {
        const _security = await SInfo.getItem('security', STORAGE_KEY);
        const security = JSON.parse(_security!);

        setIsBiometricsEnabled(security.isBiometricsEnabled);
      }
    })();
  }, []);

  if (!isFocused) return;
  return (
    <VStack flex={1} bgColor={'white'} p={'4'}>
      {isBiometricsAvailable && (
        <HStack alignItems="center" justifyContent="space-between">
          <Text fontSize={FONT_SIZE['xl']}>Sign in with Biometrics</Text>
          <Switch
            size="md"
            trackColor={{ true: COLORS.primary, false: '#E5E5E5' }}
            isChecked={isBiometricsEnabled}
            onToggle={toggleBiometrics}
          />
        </HStack>
      )}

      <Pressable onPress={() => openModal('ChangePasswordModal')} py={'4'}>
        <Text fontSize={FONT_SIZE['xl']}>Change Password</Text>
      </Pressable>
    </VStack>
  );
}
