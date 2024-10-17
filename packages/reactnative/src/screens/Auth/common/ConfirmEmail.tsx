import { useNavigation } from '@react-navigation/native';
import { Divider, Text, View, VStack } from 'native-base';
import React, { useState } from 'react';
import OTPTextView from 'react-native-otp-textinput';
import { useToast } from 'react-native-toast-notifications';
import Button from '../../../components/Button';
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader';
import { useProcedureContext } from '../../../context/ProcedureContext';
import styles from '../../../styles/global';
import { WINDOW_WIDTH } from '../../../styles/screenDimensions';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {};

export default function ConfirmEmail({}: Props) {
  const navigation = useNavigation();
  const toast = useToast();

  const { authContext } = useProcedureContext();

  const [code, setCode] = useState('');

  const confirm = () => {
    switch (authContext) {
      case 'profile_creation':
        navigation.navigate('Dashboard');
        break;

      default:
        navigation.navigate('RecoverProfile');
        break;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ProgressIndicatorHeader
        progress={2}
        steps={authContext === 'profile_recovery' ? 4 : 2}
      />

      <Divider bgColor="muted.100" my="4" />

      <Text
        textAlign="center"
        color={COLORS.primary}
        fontSize={1.4 * FONT_SIZE['xl']}
        bold
      >
        Please confirm your 2FA
      </Text>
      <Text
        textAlign="center"
        alignSelf={'center'}
        fontSize={FONT_SIZE['lg']}
        my="2"
        w={'75%'}
      >
        Open your authenticator app and enter the six digit code below.
      </Text>

      <VStack flex={1} justifyContent={'center'}>
        <OTPTextView
          inputCount={6}
          handleTextChange={code => setCode(code)}
          tintColor="#001433"
          textInputStyle={{
            width: WINDOW_WIDTH * 0.1,
            height: WINDOW_WIDTH * 0.1,
            borderWidth: 1,
            color: COLORS.primary
          }}
          containerStyle={{
            flex: 0
          }}
          autoFocus
        />
      </VStack>

      <Button text="Continue" onPress={confirm} style={{ marginBottom: 15 }} />
    </View>
  );
}
