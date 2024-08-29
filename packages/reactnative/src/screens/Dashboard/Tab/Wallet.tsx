import { HStack, Icon, Image, Pressable, ScrollView, Text, View, VStack } from 'native-base'
import React, { useEffect } from 'react'
import { BackHandler, Linking, NativeEventSubscription, StatusBar } from 'react-native'
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'

import Clipboard from '@react-native-clipboard/clipboard';

import { WINDOW_WIDTH } from '../../../styles/screenDimensions'
import Blockie from '../../../components/Blockie'
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'
import { useToast } from 'react-native-toast-notifications'
import { truncateAddress } from '../../../utils/helperFunctions'
import CopyableText from '../../../components/CopyableText'

let backHandler: NativeEventSubscription;

type WalletProps = {}
type LinkProps = {
    title: string
    url: string
}

function Link({ title, url }: LinkProps) {
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
                space={"2"}
                mt={2}
                px={2}
                py={0.5}
                borderWidth={"1"}
                borderRadius={"md"}
                borderColor={"gray.300"}
            >
                <Icon
                    as={<Ionicons name="link-outline" />}
                    size={FONT_SIZE['xl']}
                    color="gray.600"
                    rotation={-45}
                />
                <Text fontSize={"md"} fontWeight={"light"}>{title}</Text>
            </HStack>
        </Pressable>
    )
}

function Wallet({ }: WalletProps) {
    const isFocused = useIsFocused()
    const toast = useToast()

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

    if (!isFocused) return

    const copyProfileAddress = () => {
        Clipboard.setString("profile_address")
        toast.show("Copied to clipboard", {
            type: "success"
        })
    }

    return (
        <View flex={1} bgColor={"white"}>
            <StatusBar translucent barStyle={"light-content"} backgroundColor={"black"} />

            {/* Profile cover */}
            <View h={"25%"} zIndex={1}>
                <Image
                    source={require("../../../../assets/images/default_profile_cover.jpg")}
                    alt="profile cover"
                    w={"full"}
                    h={"full"}
                    resizeMode="cover"
                />

                {/* Profile image */}
                <VStack
                    position={"absolute"}
                    left={"4"}
                    bottom={-(WINDOW_WIDTH * 0.2 / 2)}
                    alignItems={"flex-start"}
                >
                    <View
                        w={WINDOW_WIDTH * 0.2}
                        style={{ aspectRatio: 1 }}
                        borderRadius={"full"}
                        borderWidth={5}
                        borderColor={"white"}
                    >
                        <Image
                            source={require("../../../../assets/images/default_profile_image.jpeg")}
                            alt="profile image"
                            w={"full"}
                            h={"full"}
                            resizeMode="cover"
                            borderRadius={"full"}
                        />
                        <View
                            position={"absolute"}
                            bottom={0}
                            right={0}
                            borderWidth={3}
                            borderColor={"white"}
                            borderRadius={"full"}
                        >
                            <Blockie address={"0x123..."} size={20} />
                        </View>
                    </View>
                </VStack>
            </View>

            <Pressable>
                <Text
                    alignSelf={"flex-end"}
                    mt={3}
                    mr={2}
                    px={"4"}
                    py={"1"}
                    borderWidth={"1"}
                    borderRadius={"2xl"}
                    borderColor={"gray.400"}
                    fontWeight={"medium"}
                >
                    Edit profile
                </Text>
            </Pressable>


            <VStack px={"2"}>
                {/* Username */}
                <Text color={COLORS.primary} fontSize={FONT_SIZE["xl"] * 1.2} bold>
                    @valentineorga
                </Text>

                {/* Profile address */}
                <CopyableText
                    displayText={truncateAddress("0xb794f5ea0ba39494ce839613fffba74279579268")}
                    value={"0xb794f5ea0ba39494ce839613fffba74279579268"}
                    textStyle={{ fontSize: FONT_SIZE["xl"], fontWeight: "400", color: "gray" }}
                    iconStyle={{ color: COLORS.primary }}
                />

                {/* Bio */}
                <Text fontSize={"md"} fontWeight={"normal"} my={2}>
                    My journey through Lukso as a Full-stack Blockchain Engineer | go right go wrong still going
                </Text>

                {/* Links */}
                <HStack flexWrap={"wrap"} space={"2"} mb={1}>
                    {[{ title: "My Portfolio", url: "https://valentineorga.vercel.app" }].map((link: LinkProps) => <Link key={link.url} title={link.title} url={link.url} />)}
                </HStack>

                {/* Tags */}
                <HStack flexWrap={"wrap"} space={"2"}>
                    {["profile"].map((tag: string) => (
                        <Text
                            fontSize={"sm"}
                            fontWeight={"light"}
                            mt={2}
                            px={2}
                            py={0.5}
                            borderWidth={"1"}
                            borderRadius={"md"}
                            borderColor={"gray.300"}
                            alignSelf={"flex-start"}
                        >
                            {tag}
                        </Text>
                    ))}
                </HStack>
            </VStack>

            {/* Tokens */}
        </View>
    )
}

export default Wallet