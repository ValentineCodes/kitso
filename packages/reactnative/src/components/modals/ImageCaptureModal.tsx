import React from 'react'

import { Actionsheet, Pressable, Text } from "native-base";
import ImagePicker from 'react-native-image-crop-picker';
import { _Image, PermissionsAndroid } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { isValidImage } from '../../utils/helperFunctions';

export type ImageType = {
    name: string;
    uri: string;
    type: string;
}
type Props = {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (image: ImageType) => void;
}

function ImageCaptureModal({ isOpen, onClose, onCapture }: Props) {
    const toast = useToast()

    async function takePhoto() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Alert App',
                    message: 'Alert needs access to your camera',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                },
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // capture photo from camera
                const image = await ImagePicker.openCamera({
                    width: 100,
                    height: 100,
                    cropping: true,
                    mediaType: 'photo',
                })
                // TO-DO: create helper function to validate images

                // validate capture
                if (
                    isValidImage(image.mime)
                ) {

                    const _image = {
                        name: image.path.substr(image.path.lastIndexOf('/') + 1),
                        uri: image.path,
                        type: image.mime,
                    }
                    onCapture(_image)

                    onClose()
                } else {
                    toast.show('This is not a valid image. Please select a valid image!', {
                        type: "warning"
                    });
                }

            } else {
                toast.show("Permissions Denied!")
            }
        } catch (error) {
            toast.show(JSON.stringify(error))
        }
    }

    async function choosePhoto() {
        try {
            const image = await ImagePicker.openPicker({
                width: 100,
                height: 100,
                cropping: true,
                mediaType: 'photo',
            })
            if (
                isValidImage(image.mime)
            ) {
                const _image = {
                    name: image.path.substr(image.path.lastIndexOf('/') + 1),
                    uri: image.path,
                    type: image.mime,
                }
                onCapture(_image)

                onClose()
            } else {
                toast.show('This is not a valid image. Please select a valid image!', {
                    type: "warning"
                });
            }
        } catch (error) {
            toast.show(JSON.stringify(error))
        }
    }

    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
                <Pressable w="100%" h={60} px={4} justifyContent="center" onPress={takePhoto}>
                    <Text fontSize="16" color="gray.500" _dark={{
                        color: "gray.300"
                    }}>
                        Take Photo
                    </Text>
                </Pressable>
                <Pressable w="100%" h={60} px={4} justifyContent="center" onPress={choosePhoto}>
                    <Text fontSize="16" color="gray.500" _dark={{
                        color: "gray.300"
                    }}>
                        Choose Photo
                    </Text>
                </Pressable>
            </Actionsheet.Content>
        </Actionsheet>
    )
}

export default ImageCaptureModal