import ERC725 from '@erc725/erc725.js';
// ERC725.js schemas
import LSP1UniversalReceiverDelegateSchemas from '@erc725/erc725.js/schemas/LSP1UniversalReceiverDelegate.json';
import LSP3ProfileMetadataSchemas from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import LSP6KeyManagerSchemas from '@erc725/erc725.js/schemas/LSP6KeyManager.json';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { AbiCoder, ethers } from 'ethers';
import { Divider, Icon, Text, View, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import uuid from 'react-native-uuid';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch } from 'react-redux';
import Button from '../../../components/Button';
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader';
import { useSecureStorage } from '../../../hooks/useSecureStorage';
import { Controller } from '../../../hooks/useWallet';
import { loginUser } from '../../../store/reducers/Auth';
import styles from '../../../styles/global';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';

type DeploymentStatus = 'loading' | 'success' | 'error';

export default function DeployProfile() {
  const navigation = useNavigation();
  const route = useRoute();

  const { getItem } = useSecureStorage();
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

  const generatePostDeploymentCalldata = async () => {
    // instantiate the erc725 class
    const erc725 = new ERC725([
      ...LSP6KeyManagerSchemas,
      ...LSP3ProfileMetadataSchemas,
      ...LSP1UniversalReceiverDelegateSchemas
    ]);

    const controller = (await getItem('controller')) as Controller;

    const universalReceiverAddress =
      '0x7870C5B8BC9572A8001C3f96f7ff59961B23500D';
    const mainController = controller.address;

    // create the permissions data keys
    const setDataKeysAndValues = erc725.encodeData([
      { keyName: 'LSP3Profile', value: lsp3DataValue }, // LSP3Metadata data key and value
      {
        keyName: 'LSP1UniversalReceiverDelegate',
        value: universalReceiverAddress
      }, // Universal Receiver data key and value
      {
        keyName: 'AddressPermissions:Permissions:<address>',
        dynamicKeyParts: [universalReceiverAddress],
        value: erc725.encodePermissions({
          REENTRANCY: true,
          SUPER_SETDATA: true
        })
      }, // Universal Receiver Delegate permissions data key and value
      {
        keyName: 'AddressPermissions:Permissions:<address>',
        dynamicKeyParts: [mainController],
        value: erc725.encodePermissions({
          CHANGEOWNER: true,
          ADDCONTROLLER: true,
          EDITPERMISSIONS: true,
          ADDEXTENSIONS: true,
          CHANGEEXTENSIONS: true,
          ADDUNIVERSALRECEIVERDELEGATE: true,
          CHANGEUNIVERSALRECEIVERDELEGATE: true,
          REENTRANCY: false,
          SUPER_TRANSFERVALUE: true,
          TRANSFERVALUE: true,
          SUPER_CALL: true,
          CALL: true,
          SUPER_STATICCALL: true,
          STATICCALL: true,
          SUPER_DELEGATECALL: false,
          DELEGATECALL: false,
          DEPLOY: true,
          SUPER_SETDATA: true,
          SETDATA: true,
          ENCRYPT: true,
          DECRYPT: true,
          SIGN: true,
          EXECUTE_RELAY_CALL: true
        }) // Main Controller permissions data key and value
      },
      // length of the Address Permissions array and their respective indexed keys and values
      {
        keyName: 'AddressPermissions[]',
        value: [universalReceiverAddress, mainController]
      }
    ]);

    const abiCoder = new AbiCoder();

    const initializeEncodedBytes = abiCoder.encode(
      ['bytes32[]', 'bytes[]'],
      [setDataKeysAndValues.keys, setDataKeysAndValues.values]
    );

    return initializeEncodedBytes;
  };

  const deployProfile = async () => {
    setDeploymentStatus('loading');

    const apiKey = 'c458a062-86ec-44d2-af86-3767d00e40c7';
    const url =
      'https://relayer-api.testnet.lukso.network/v1/relayer/universal-profile';

    const data = {
      salt: ethers.hexlify(ethers.randomBytes(32)),
      postDeploymentCallData: await generatePostDeploymentCalldata(),
      userId: uuid.v4()
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Universal Profile deployed:', response.data);

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
