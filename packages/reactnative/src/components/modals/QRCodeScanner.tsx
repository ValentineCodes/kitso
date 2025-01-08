import { Icon, Pressable, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { Camera as VCamera } from 'react-native-vision-camera';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/styles';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      onScan: (value: string) => void;
    };
  };
};

export default function QRCodeScanner({ modal: { closeModal, params } }: Props) {
  const [isCameraPermitted, setIsCameraPermitted] = useState(false);

  const toast = useToast();

  const requestCameraPermission = async () => {
    // check permission
    const cameraPermission = await VCamera.getCameraPermissionStatus();

    if (cameraPermission === 'restricted') {
      toast.show('Cannot use camera', {
        type: 'danger'
      });
      closeModal();
    } else if (
      cameraPermission === 'not-determined' ||
      cameraPermission === 'denied'
    ) {
      try {
        const newCameraPermission = await VCamera.requestCameraPermission();

        if (newCameraPermission === 'granted') {
          setIsCameraPermitted(true);
        } else {
          toast.show(
            'Camera permission denied. Go to your device settings to Enable Camera',
            {
              type: 'warning'
            }
          );
          closeModal();
        }
      } catch (error) {
        toast.show('Go to your device settings to Enable Camera', {
          type: 'normal',
          duration: 5000
        });
        closeModal();
      }
    } else {
      setIsCameraPermitted(true);
    }
  };

  useEffect(() => {
    (async () => {
      await requestCameraPermission();
    })();
  }, []);

  return (
    isCameraPermitted && (
      <View 
      w={WINDOW_WIDTH}
      h={WINDOW_HEIGHT}
      >
        <Camera
          scanBarcode={true}
          onReadCode={(event: { nativeEvent: { codeStringValue: string } }) => {
            params.onScan(event.nativeEvent.codeStringValue);
          }}
          showFrame={true}
          laserColor="blue"
          frameColor="white"
          style={styles.scanner}
        />
        <Pressable
          onPress={closeModal}
          _pressed={{ opacity: 0.4 }}
          position={'absolute'}
          top={45}
          right={15}
        >
          <Icon as={<Ionicons name="close" />} size={10} mr="2" color="white" />
        </Pressable>
        </View>
    )
  );
}

const styles = StyleSheet.create({
  scanner: {
    width: '100%',
    height: '100%'
  }
});
