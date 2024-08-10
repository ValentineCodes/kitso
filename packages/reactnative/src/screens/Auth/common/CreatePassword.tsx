import { HStack, Switch, Text, VStack, ScrollView, Divider, View } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { generate } from "random-words";
import ReactNativeBiometrics from 'react-native-biometrics'
import { useToast } from 'react-native-toast-notifications'


import { useFocusEffect, useNavigation } from '@react-navigation/native'
import PasswordInput from '../../../components/forms/PasswordInput'

import { COLORS } from '../../../utils/constants'
import Button from '../../../components/Button'
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader'
import { FONT_SIZE } from '../../../utils/styles'
import styles from "../../../styles/global"
import { useProcedureContext } from '../../../context/ProcedureContext';
import useSecurity from '../../../hooks/useSecurity';

type Props = {}

function CreatePassword({ }: Props) {
    const { authContext } = useProcedureContext()

    const navigation = useNavigation()
    const toast = useToast()

    const [suggestion, setSuggestion] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false)

    const { setSecurity } = useSecurity()

    const createPassword = async () => {
        if (!password) {
            toast.show("Password cannot be empty!", {
                type: "danger"
            })
            return
        }

        if (password.length < 8) {
            toast.show("Password must be at least 8 characters", {
                type: "danger"
            })
            return
        }

        if (password !== confirmPassword) {
            toast.show("Passwords do not match!", {
                type: "danger"
            })
            return
        }

        try {
            // store password and biometrics
            setIsCreating(true)

            const security = {
                password,
                isBiometricsEnabled
            }

            await setSecurity(security)

            // clean up
            setPassword("")
            setConfirmPassword("")
            setIsBiometricsEnabled(false)

            switch (authContext) {
                case 'profile_creation':
                    navigation.navigate("SelectProfile")
                    break;

                default:
                    navigation.navigate("Dashboard")
                    break;
            }
        } catch (error) {
            toast.show("Failed to create password. Please try again", {
                type: "danger"
            })
        } finally {
            setIsCreating(false)
        }
    }

    // set suggested password
    useFocusEffect(
        useCallback(() => {
            setSuggestion(generate({ exactly: 2, join: "", minLength: 4, maxLength: 5 }))
        }, [])
    )

    // check biometrics availability
    useEffect(() => {
        (async () => {
            const rnBiometrics = new ReactNativeBiometrics()

            const { available } = await rnBiometrics.isSensorAvailable()

            if (available) {
                setIsBiometricsAvailable(available)
            }
        })()
    }, [])

    return (
        <View style={styles.screenContainer}>
            <ProgressIndicatorHeader progress={authContext === "profile_creation" ? 1 : 4} steps={4} />

            <Divider bgColor="muted.100" my="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize={1.4 * FONT_SIZE["xl"]} bold>Create Password</Text>
            <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} my="2" w={"75%"}>
                Please secure Kitso with a strong password
            </Text>

            <ScrollView flex="1">
                <VStack space={6} mb="50" mt="4">
                    <PasswordInput label="New Password" value={password} suggestion={suggestion} infoText={password.length < 8 && 'Must be at least 8 characters'} onChange={setPassword} />
                    <PasswordInput label="Confirm New Password" value={confirmPassword} suggestion={suggestion} infoText={password && confirmPassword && password !== confirmPassword && 'Password must match'} onChange={setConfirmPassword} />

                    {isBiometricsAvailable && (
                        <>
                            <Divider bgColor="muted.100" />

                            <HStack alignItems="center" justifyContent="space-between">
                                <Text fontSize={FONT_SIZE['xl']}>Sign in with Biometrics</Text>
                                <Switch size="md" trackColor={{ true: COLORS.primary, false: "#E5E5E5" }} isChecked={isBiometricsEnabled} onToggle={setIsBiometricsEnabled} />
                            </HStack>
                        </>
                    )}

                    <Divider bgColor="muted.100" />
                </VStack>
            </ScrollView>

            <Button text="Continue" loading={isCreating} onPress={createPassword} style={{ marginBottom: 15 }} />
        </View>
    )
}

export default CreatePassword