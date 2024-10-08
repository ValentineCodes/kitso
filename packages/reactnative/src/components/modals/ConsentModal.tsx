import { VStack, Text, HStack, Icon } from 'native-base';
import React from 'react'
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import { Dimensions } from 'react-native';
import Button from '../Button';
// @ts-ignore
import Ionicons from "react-native-vector-icons/dist/Ionicons"

type Props = {
    modal: {
        closeModal: (modal?: string, callback?: () => void) => void
        params: {
            icon?: JSX.Element;
            title: string;
            subTitle: string;
            okText?: string;
            cancelText?: string;
            isOkLoading?: boolean;
            isCancelLoading?: boolean;
            onAccept: () => void;
            onClose: () => void;
        }
    }
}

export default function ConsentModal({ modal: { closeModal, params } }: Props) {
    const { icon, title, subTitle, okText, cancelText, isOkLoading, isCancelLoading, onAccept, onClose} = params

    const handleOnAccept = () => {
        closeModal("ConsentModal")

        onAccept()
    }

    const handleOnClose = () => {
        closeModal("ConsentModal")
    }
    return (
            <VStack bgColor="white" borderRadius="30" px="7" py="5" alignItems="center" space="4">
                {icon || <Icon as={<Ionicons name="warning-outline" />} size={Dimensions.get("window").height * 0.17} color={COLORS.primary} />}
                <Text color={COLORS.primary} bold fontSize={1.5 * FONT_SIZE['xl']} textAlign="center">{title}</Text>
                <Text fontSize={FONT_SIZE['xl']} textAlign="center">{subTitle}</Text>

                <HStack w="full" mt="5" alignItems="center" justifyContent="space-between">
                    <Button type="outline" text={cancelText || "Cancel"} onPress={handleOnClose} style={{ width: "50%", borderRadius: 0 }} loading={isCancelLoading} />
                    <Button text={okText || "Ok"} onPress={handleOnAccept} style={{ width: "50%", borderRadius: 0 }} loading={isOkLoading} />
                </HStack>
            </VStack>
    )
}