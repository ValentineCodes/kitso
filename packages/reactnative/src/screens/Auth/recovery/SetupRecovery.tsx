import React, { useState } from 'react'
import { Divider, HStack, Icon, Image, Pressable, Text, View, VStack } from 'native-base'
import Ionicons from 'react-native-vector-icons/dist/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useToast } from 'react-native-toast-notifications';

import styles from "../../../styles/global"
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader'

type Props = {}

type RecoveryOptionProps = {
    icon: JSX.Element;
    title: string;
    onPress: () => void;
}
const RecoveryOption = ({ icon, title, onPress }: RecoveryOptionProps) => {
    return (
        <Pressable onPress={onPress} _pressed={{ opacity: 0.4 }}>
            <HStack
                w={"full"}
                borderWidth={1}
                borderColor={"gray.200"}
                p={"4"}
                mb={"4"}
                alignItems={"center"}
            >
                {icon}
                <Text fontSize={FONT_SIZE['xl']} fontWeight={"medium"}>{title}</Text>
            </HStack>
        </Pressable>
    )
}

export default function SetupRecovery({ }: Props) {
    const navigation = useNavigation()
    const toast = useToast()

    return (
        <View style={styles.screenContainer}>
            <ProgressIndicatorHeader progress={1} steps={4} />

            <Divider bgColor="muted.100" my="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize={1.4 * FONT_SIZE["xl"]} bold>Choose recovery method</Text>
            <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} my="2" w={"75%"}>
                Select an email account to be used as your recovery method. 2FA will be setup next.
            </Text>


            <VStack flex={1} justifyContent={"center"}>
                <RecoveryOption
                    title='Google account'
                    icon={<Image
                        source={require('../../../../assets/images/google_logo.webp')}
                        alt='Google logo'
                        w={"10"}
                        style={{ aspectRatio: 1 }}
                    />}
                    onPress={() => navigation.navigate("ConfirmEmail")}
                />
                <RecoveryOption
                    title='Email'
                    icon={<Icon as={<Ionicons name="mail-outline" />} size={1.3 * FONT_SIZE['xl']} color="gray.400" mr={"2"} />}
                    onPress={() => navigation.navigate("ConfirmEmail")}
                />
            </VStack>


            <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} my="2" w={"75%"}>
                Your email and 2FA method are not stored in plain text and are not readable by us
            </Text>
        </View>
    )
}