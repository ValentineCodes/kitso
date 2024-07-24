import React, { useState } from 'react'
import { Divider, Text, View, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { useToast } from 'react-native-toast-notifications';
import OTPTextView from 'react-native-otp-textinput';

import styles from "../../../styles/global"
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader'
import Button from '../../../components/Button';
import { DEVICE_WIDTH } from '../../../styles/screenDimensions';

type Props = {}

export default function ConfirmEmail({ }: Props) {
    const navigation = useNavigation()
    const toast = useToast()

    const [code, setCode] = useState("")

    const confirm = () => {

    }

    return (
        <View style={styles.screenContainer}>
            <ProgressIndicatorHeader progress={2} steps={4} />

            <Divider bgColor="muted.100" my="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize={1.4 * FONT_SIZE["xl"]} bold>Please confirm your 2FA</Text>
            <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} my="2" w={"75%"}>
                Open your authenticator app and enter the six digit code below.
            </Text>


            <VStack flex={1} justifyContent={"center"}>
                <OTPTextView
                    inputCount={6}
                    handleTextChange={code => setCode(code)}
                    tintColor="#001433"
                    textInputStyle={{
                        width: DEVICE_WIDTH * 0.1,
                        height: DEVICE_WIDTH * 0.1,
                        borderWidth: 1,
                        color: COLORS.primary
                    }}
                    containerStyle={{
                        flex: 0,
                    }}
                    autoFocus
                />

            </VStack>


            <Button text="Continue" onPress={confirm} style={{ marginBottom: 15 }} />
        </View>
    )
}