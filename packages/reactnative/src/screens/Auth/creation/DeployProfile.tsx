import React, { useEffect, useState } from 'react'
import { Divider, HStack, Icon, Text, View, VStack } from 'native-base'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons'
import SInfo from "react-native-sensitive-info";

import styles from "../../../styles/global"
import { COLORS, STORAGE_KEY } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader'
import Button from '../../../components/Button'
import { ActivityIndicator } from 'react-native';
import ProfileAPI from '../../../apis/ProfileAPI';
import { useDispatch } from 'react-redux';
import { initProfiles } from '../../../store/reducers/Profiles';
import { loginUser } from '../../../store/reducers/Auth';

type DeploymentStatusProps = 'loading' | 'success' | 'error';

export default function DeployProfile() {
    const navigation = useNavigation()
    const route = useRoute()
    // @ts-ignore
    const { lsp3DataValue } = route.params
    const toast = useToast()

    const dispatch = useDispatch()

    const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatusProps>("loading")

    const setupRecovery = () => {
        // @ts-ignore
        navigation.navigate("SetupRecovery")
    }

    const deployProfile = async () => {
        if (deploymentStatus !== "loading") {
            setDeploymentStatus("loading")
        }

        try {
            // read accounts from secure storage
            const _controller = await SInfo.getItem("controller", STORAGE_KEY);
            const controller = JSON.parse(_controller!)

            const data = {
                lsp3DataValue,
                mainController: controller.address,
                universalReceiverAddress: "0x7870C5B8BC9572A8001C3f96f7ff59961B23500D"
            }

            const profile = await ProfileAPI.createProfile(data)

            dispatch(initProfiles({
                address: profile.universalProfileAddress,
                keyManager: profile.keyManagerAddress
            }))

            dispatch(loginUser())

            setDeploymentStatus("success")
        } catch (error) {
            setDeploymentStatus("error")
            toast.show("Deployment failed", { type: "danger" })
            console.error(error)
        }
    }

    useEffect(() => {
        deployProfile()
    }, [])
    return (
        <View style={styles.screenContainer} pt={"10"}>
            <ProgressIndicatorHeader progress={4} steps={4} />

            <Divider bgColor="muted.100" my="4" />

            {
                deploymentStatus === "success" ? (
                    <Text textAlign="center" color={COLORS.primary} fontSize={1.4 * FONT_SIZE["xl"]} bold>Profile deployed!</Text>
                ) : (
                    <Text textAlign="center" color={COLORS.primary} fontSize={1.4 * FONT_SIZE["xl"]} bold>Deploying your profile</Text>
                )
            }

            <VStack flex={1} justifyContent={"center"} alignItems={"center"}>
                {
                    deploymentStatus === "loading" ?
                        <ActivityIndicator size={"large"} color={COLORS.primary} />
                        :
                        deploymentStatus === "success" ? (
                            <Icon as={<Ionicons name="checkmark-circle" />} size={5 * FONT_SIZE['xl']} color={COLORS.primary} />
                        ) : (
                            <Icon as={<Ionicons name="close-circle" />} size={5 * FONT_SIZE['xl']} color={"red.200"} />
                        )
                }
            </VStack>


            {
                deploymentStatus === "loading" ? (
                    <Text
                        textAlign="center"
                        alignSelf={"center"}
                        fontSize={FONT_SIZE['lg']}
                        color={"gray.600"}
                    >
                        Please be patient during the creation process
                    </Text>
                ) :
                    deploymentStatus === "success" ? (
                        <>
                            <Button text="Setup recovery" onPress={setupRecovery} style={{ marginTop: 40 }} />
                            {/* @ts-ignore */}
                            <Button text="No, I don't need recovery" type="outline" onPress={() => navigation.navigate("Dashboard")} style={{ marginVertical: 15 }} />

                        </>
                    ) : (
                        <Button text="Try again" onPress={deployProfile} style={{ marginTop: 40 }} />
                    )
            }
        </View>
    )
}