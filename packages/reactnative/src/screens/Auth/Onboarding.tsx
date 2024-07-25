import React, { useEffect } from 'react'
import { BackHandler, NativeEventSubscription } from 'react-native'
import { ScrollView, Image, Text, VStack, HStack } from 'native-base'

import Button from '../../components/Button'
import { COLORS } from '../../utils/constants'
import { FONT_SIZE } from '../../utils/styles'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useProcedureContext } from '../../context/ProcedureContext'
import { WINDOW_WIDTH } from '../../styles/screenDimensions'

let backHandler: NativeEventSubscription;

type Props = {}

export default function Onboarding({ }: Props) {
    const navigation = useNavigation()

    const { setAuthContext } = useProcedureContext()

    const createProfile = () => {
        navigation.navigate("CreatePassword")
        setAuthContext("profile_creation")
        backHandler?.remove()
    }

    const recoverProfile = () => {
        navigation.navigate("SetupRecovery")
        setAuthContext("profile_recovery")
        backHandler?.remove()
    }

    useFocusEffect(() => {
        backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();

            return true;
        });
    })

    useEffect(() => {
        return () => {
            backHandler?.remove();
        };
    }, [])

    return (
        <ScrollView contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }} style={{
            paddingHorizontal: 15,
            backgroundColor: 'white'
        }}>
            <Image source={require("../../../assets/images/app_logo.jpg")} alt='Kitso' width={WINDOW_WIDTH * 0.3} height={WINDOW_WIDTH * 0.3} />
            <VStack w="full" mt="10">
                <Text textAlign="center" color={COLORS.primary} fontSize={2 * FONT_SIZE["xl"]} bold>Build Great Ideas!</Text>
                <Text textAlign="center" fontSize={FONT_SIZE["lg"]} my="4">
                    First, we'll need a universal profile. This will be used to manage funds, sign transactions and messages.
                </Text>

                <HStack w="full" mt="5" alignItems="center" justifyContent="space-between">
                    <Button text="Create Profile" onPress={createProfile} style={{ width: "49%" }} />
                    <Button text="Recover Profile" type="outline" onPress={recoverProfile} style={{ width: "49%" }} />
                </HStack>
            </VStack>
        </ScrollView>
    )
}