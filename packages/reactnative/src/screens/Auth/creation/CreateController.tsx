import React, { useState } from 'react'
import { Divider, HStack, Icon, Pressable, Text, View, VStack } from 'native-base'
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons'
import { useNavigation } from '@react-navigation/native'
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications';

import styles from "../../../styles/global"
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader'
import Button from '../../../components/Button'
import Blockie from '../../../components/Blockie'
import { StyleSheet } from 'react-native';

type Props = {}

const profiles = [
    '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    '0x53d284357ec70ce289d6d64134dfac8e511c8a3d',
    '0xfe9e8709d3215310075d67e3ed32a380ccf451c8',
    '0x66f820a414680b5bcda5eeca5dea238543f42054',
]

export default function CreateController({ }: Props) {
    const navigation = useNavigation()
    const toast = useToast()

    const [selectedProfile, setSelectedProfile] = useState(profiles[0])

    const generateNewProfiles = () => {

    }

    const confirm = () => {
        // @ts-ignore
        navigation.navigate("CreateProfile")
    }

    const copyProfile = () => {
        Clipboard.setString(selectedProfile)
        toast.show("Copied to clipboard", {
            type: 'success'
        })
    }
    return (
        <View style={styles.screenContainer}>
            <ProgressIndicatorHeader progress={2} steps={4} />

            <Divider bgColor="muted.100" my="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize={1.4 * FONT_SIZE["xl"]} bold>Select Profile Address</Text>
            <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} my="2" w={"75%"}>
                Kitso requires an address generated according to the LSP23 multi-chain standard
            </Text>


            <VStack flex={1} justifyContent={"center"}>

                {/* Generated Profiles  */}
                <HStack alignItems={"center"} justifyContent={"space-between"} mb={"6"}>
                    {profiles.map(profile => (
                        <Pressable
                            key={profile}
                            onPress={() => setSelectedProfile(profile)}
                            _pressed={{ opacity: 0.4 }}
                            style={profile === selectedProfile ? profileStyles.selectedProfile : null}
                        >
                            <Blockie address={profile} size={FONT_SIZE["xl"] * 2.8} />
                        </Pressable>
                    ))}
                    <Pressable
                        onPress={generateNewProfiles}
                        _pressed={{ opacity: 0.4 }}
                        borderWidth={1.5}
                        borderColor={"gray.300"}
                        borderRadius={"full"}
                        w={FONT_SIZE["xl"] * 2.8}
                        style={{ aspectRatio: 1 }}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Icon as={<Ionicons name="reload-outline" />} size={1.3 * FONT_SIZE['xl']} color={"gray.600"} />
                    </Pressable>
                </HStack>

                {/* Selected Profile */}
                <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} my="2" w={"75%"}>
                    Happy with your Universal Profile Address?
                </Text>

                <HStack alignItems="center" w="full" borderWidth="1" borderColor={COLORS.primary} borderRadius={10} p="4">
                    <Text fontSize={FONT_SIZE['lg']} fontWeight={"medium"} w="90%" mr="2" textAlign={"center"}>{selectedProfile}</Text>
                    <Pressable onPress={copyProfile} _pressed={{ opacity: 0.4 }}><Icon as={<Ionicons name="copy-outline" />} size={5} color={COLORS.primary} /></Pressable>
                </HStack>
            </VStack>


            <Button text="Confirm address" onPress={confirm} style={{ marginBottom: 15 }} />
        </View>
    )
}

const profileStyles = StyleSheet.create({
    selectedProfile: {
        borderWidth: 1,
        borderRadius: 100,
        padding: 4
    }
})