import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HStack, Image, ScrollView, Text, VStack } from 'native-base';
import React from 'react';
import { BackHandler, NativeEventSubscription } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import { useProcedureContext } from '../../context/ProcedureContext';
import { loginUser } from '../../store/reducers/Auth';
import { WINDOW_WIDTH } from '../../styles/screenDimensions';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

let backHandler: NativeEventSubscription;

type Props = {};

export default function Onboarding({}: Props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // @ts-ignore
  const isProfileDeployed = useSelector(state => state.profiles.length > 0);

  const { setAuthContext } = useProcedureContext();

  const createProfile = () => {
    // @ts-ignore
    navigation.navigate('CreatePassword');
    setAuthContext('profile_creation');
    backHandler?.remove();
  };

  const recoverProfile = () => {
    // @ts-ignore
    navigation.navigate('SetupRecovery');
    setAuthContext('profile_recovery');
    backHandler?.remove();
  };

  useFocusEffect(() => {
    if (isProfileDeployed) {
      dispatch(loginUser());
      return;
    }
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();

      return true;
    });
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      style={{
        paddingHorizontal: 15,
        backgroundColor: 'white'
      }}
    >
      <Image
        source={require('../../../assets/images/app_logo.png')}
        alt="Kitso"
        width={WINDOW_WIDTH * 0.3}
        height={WINDOW_WIDTH * 0.3}
      />
      <VStack w="full" mt="10">
        <Text
          textAlign="center"
          color={COLORS.primary}
          fontSize={2 * FONT_SIZE['xl']}
          bold
        >
          Build Great Ideas!
        </Text>
        <Text textAlign="center" fontSize={FONT_SIZE['lg']} my="4">
          First, we'll need a universal profile. This will be used to manage
          funds, sign transactions and messages.
        </Text>

        <HStack
          w="full"
          mt="5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            text="Create Profile"
            onPress={createProfile}
            style={{ width: '49%' }}
          />
          <Button
            text="Recover Profile"
            type="outline"
            onPress={recoverProfile}
            style={{ width: '49%' }}
          />
        </HStack>
      </VStack>
    </ScrollView>
  );
}
