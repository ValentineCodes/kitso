import React from 'react'
import { Pressable, Text, HStack, Icon } from 'native-base'
import { Linking } from 'react-native'
import { useToast } from 'react-native-toast-notifications'
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons'

import { FONT_SIZE } from '../../../../../utils/styles'

export interface LinkProps {
    title: string
    url: string
}

export default function Link({ title, url }: LinkProps) {
    const toast = useToast()

    const openURL = async () => {
        try {
            await Linking.openURL(url)
        } catch (error) {
            console.error(error)
            toast.show("Failed to open URL", { type: 'danger' })
        }
    }
    return (
        <Pressable onPress={openURL}>
            <HStack
                alignItems={"center"}
                alignSelf={"flex-start"}
                space={2}
                mt={2}
                px={2}
                py={0.5}
                borderWidth={"1"}
                borderRadius={"2xl"}
                borderColor={"gray.300"}
            >
                <Icon
                    as={<Ionicons name="link-outline" />}
                    size={FONT_SIZE['lg']}
                    color="gray.600"
                    rotation={-45}
                />
                <Text fontSize={"sm"} fontWeight={"light"}>{title}</Text>
            </HStack>
        </Pressable>
    )
}