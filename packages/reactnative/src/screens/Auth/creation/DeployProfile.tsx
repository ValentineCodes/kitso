import React, { useState } from 'react'
import { Divider, HStack, Icon, Text, View, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { useToast } from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/dist/Ionicons'

import styles from "../../../styles/global"
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader'
import Button from '../../../components/Button'
import { ActivityIndicator } from 'react-native';

type Props = {}

interface ProcessProps {
    title: string;
    status: 'queue' | 'loading' | 'complete';
}
const Process = ({ title, status }: ProcessProps) => {
    const renderStatusIcon = () => {
        if (status === "queue") {
            return <Icon as={<Ionicons name="ellipsis-horizontal-circle" />} size={1.3 * FONT_SIZE['xl']} color={"gray.400"} />
        }

        if (status === "loading") {
            return <Icon as={<Ionicons name="radio-button-on-outline" />} size={1.3 * FONT_SIZE['xl']} color={COLORS.primary} />
        }

        return <Icon as={<Ionicons name="checkmark-circle" />} size={1.3 * FONT_SIZE['xl']} color={COLORS.primary} />
    }
    return (
        <HStack alignItems={"center"} alignSelf={"flex-start"}>
            {renderStatusIcon()}
            <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['xl']} ml={"2"}>
                {title}
            </Text>
        </HStack>
    )
}

export default function DeployProfile({ }: Props) {
    const navigation = useNavigation()
    const toast = useToast()

    const [isDeploying, setIsDeploying] = useState(false)

    const setupRecovery = () => {
        navigation.navigate("SelectRecoveryMethod")
    }
    return (
        <View style={styles.screenContainer}>
            <ProgressIndicatorHeader progress={4} steps={4} />

            <Divider bgColor="muted.100" my="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize={1.4 * FONT_SIZE["xl"]} bold>Deploying your profile</Text>

            <VStack space={"4"} alignSelf={"center"} mt={"20"}>
                <Process title="Initiating Universal Profile" status='complete' />
                <Process title="Channelling profile data" status='complete' />
                <Process title="Transferring controls" status='complete' />
                <Process title="Universal Profile created!" status='complete' />
            </VStack>

            <VStack flex={1} justifyContent={"center"} alignItems={"center"}>
                {isDeploying ?
                    <ActivityIndicator size={"large"} color={COLORS.primary} />
                    :
                    <Icon as={<Ionicons name="checkmark-circle" />} size={2.7 * FONT_SIZE['xl']} color={COLORS.primary} />
                }
            </VStack>


            {isDeploying ? <Text
                textAlign="center"
                alignSelf={"center"}
                fontSize={FONT_SIZE['lg']}
                color={"gray.600"}
            >Please be patient during the creation process</Text> : (
                <>
                    <Button text="Setup recovery" onPress={setupRecovery} style={{ marginTop: 40 }} />
                    <Button text="No, I don't need recovery" type="outline" onPress={() => null} style={{ marginVertical: 15 }} />

                </>
            )
            }
        </View>
    )
}