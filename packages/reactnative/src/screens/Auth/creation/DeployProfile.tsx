import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider, Icon, Text, View, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import SInfo from 'react-native-sensitive-info';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch } from 'react-redux';
import ProfileAPI from '../../../apis/ProfileAPI';
import Button from '../../../components/Button';
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader';
import { loginUser } from '../../../store/reducers/Auth';
import { initProfiles } from '../../../store/reducers/Profiles';
import styles from '../../../styles/global';
import { COLORS, STORAGE_KEY } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';

type DeploymentStatus = 'loading' | 'success' | 'error';

export default function DeployProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { lsp3DataValue } = route.params;
  const toast = useToast();
  const dispatch = useDispatch();

  const [deploymentStatus, setDeploymentStatus] =
    useState<DeploymentStatus>('loading');

  const setupRecovery = () => {
    // @ts-ignore
    navigation.navigate('SetupRecovery');
  };

  const deployProfile = async () => {
    setDeploymentStatus('loading');

    try {
      const _controller = await SInfo.getItem('controller', STORAGE_KEY);
      const controller = JSON.parse(_controller!);

      const data = {
        lsp3DataValue,
        mainController: controller.address,
        universalReceiverAddress: '0x7870C5B8BC9572A8001C3f96f7ff59961B23500D'
      };

      const profile = await ProfileAPI.createProfile(data);
      dispatch(
        initProfiles({
          address: profile.universalProfileAddress,
          keyManager: profile.keyManagerAddress
        })
      );

      setDeploymentStatus('success');
    } catch (error) {
      setDeploymentStatus('error');
      toast.show('Deployment failed', { type: 'danger' });
      console.error(error);
    }
  };

  useEffect(() => {
    deployProfile();
  }, []);

  const renderStatusMessage = () => {
    switch (deploymentStatus) {
      case 'loading':
        return { message: 'Deploying your profile', color: COLORS.primary };
      case 'success':
        return { message: 'Profile deployed!', color: COLORS.primary };
      case 'error':
        return { message: 'Deployment failed!', color: 'red.400' };
      default:
        return { message: '', color: COLORS.primary };
    }
  };

  const renderStatusIcon = () => {
    if (deploymentStatus === 'loading') {
      return <ActivityIndicator size="large" color={COLORS.primary} />;
    }
    return (
      <Icon
        as={
          <Ionicons
            name={
              deploymentStatus === 'success'
                ? 'checkmark-circle'
                : 'close-circle'
            }
          />
        }
        size={5 * FONT_SIZE.xl}
        color={deploymentStatus === 'success' ? COLORS.primary : 'red.400'}
      />
    );
  };

  const { message, color } = renderStatusMessage();

  return (
    <View style={styles.screenContainer} pt="10">
      <ProgressIndicatorHeader progress={4} steps={4} />

      <Divider bgColor="muted.100" my="4" />

      <Text textAlign="center" color={color} fontSize={1.4 * FONT_SIZE.xl} bold>
        {message}
      </Text>

      <VStack flex={1} justifyContent="center" alignItems="center">
        {renderStatusIcon()}
      </VStack>

      {deploymentStatus === 'loading' ? (
        <Text
          textAlign="center"
          alignSelf="center"
          fontSize={FONT_SIZE.lg}
          color="gray.600"
        >
          Please be patient during the deployment process
        </Text>
      ) : deploymentStatus === 'success' ? (
        <>
          <Button
            text="Setup recovery"
            onPress={setupRecovery}
            style={{ marginTop: 40 }}
          />
          {/* @ts-ignore */}
          <Button
            text="No, I don't need recovery"
            type="outline"
            onPress={() => dispatch(loginUser())}
            style={{ marginVertical: 15 }}
          />
        </>
      ) : (
        <Button
          text="Try again"
          onPress={deployProfile}
          style={{ marginTop: 40 }}
        />
      )}
    </View>
  );
}
