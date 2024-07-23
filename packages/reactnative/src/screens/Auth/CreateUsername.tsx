import React, { useState } from 'react'
import { Divider, Input, Text, View, VStack } from 'native-base'

import styles from "../../styles/global"
import { COLORS } from '../../utils/constants'
import { FONT_SIZE } from '../../utils/styles'
import ProgressIndicatorHeader from '../../components/headers/ProgressIndicatorHeader'
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native'

type Props = {}

export default function CreateUsername({ }: Props) {
    const navigation = useNavigation()

    const [name, setName] = useState("")
    const [error, setError] = useState("")

    const handleInputChange = (value: string) => {
        setName(value)
        if (error) {
            setError("")
        }
    }

    const addUsername = () => {
        if (name !== name.toLowerCase()) {
            setError("Lowercase letters only!")
            return
        }

        navigation.navigate("CreatePassword")
    }

    const stayAnonymous = () => {
        navigation.navigate("CreatePassword")
    }
    return (
        <View style={styles.screenContainer}>
            <ProgressIndicatorHeader progress={1} steps={4} />

            <Divider bgColor="muted.100" my="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize={1.4 * FONT_SIZE["xl"]} bold>Username or anonymous?</Text>
            <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} my="2" w={"75%"}>
                Create a username or keep it anonymous, it's up to you!
            </Text>


            <VStack flex={1}>
                {/* Username input field */}
                <Input
                    placeholder='e.g spongebob3000'
                    value={name}
                    onChangeText={handleInputChange}
                    onSubmitEditing={addUsername}
                    borderRadius="lg"
                    variant="filled"
                    fontSize="md"
                    mt={FONT_SIZE["xl"] * 3}
                    focusOutlineColor={COLORS.primary}
                    selectTextOnFocus
                    _input={{
                        selectionColor: COLORS.highlight,
                        cursorColor: COLORS.primary,
                    }}
                />

                {error && <Text fontSize="sm" color="red.400">{error}</Text>}
            </VStack>


            <Button text="Add username" onPress={addUsername} style={{ marginTop: 40 }} />
            <Button text="Stay anonymous" type="outline" onPress={stayAnonymous} style={{ marginVertical: 15 }} />
        </View>
    )
}