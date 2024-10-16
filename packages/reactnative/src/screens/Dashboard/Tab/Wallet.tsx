import { HStack, Image, Pressable, ScrollView, Text, View, VStack } from 'native-base'
import React, { useEffect } from 'react'
import { BackHandler, NativeEventSubscription, StatusBar } from 'react-native'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'

import { WINDOW_WIDTH } from '../../../styles/screenDimensions'
import Blockie from '../../../components/Blockie'
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE, WINDOW_HEIGHT } from '../../../utils/styles'
import { truncateAddress } from '../../../utils/helperFunctions'
import CopyableText from '../../../components/CopyableText'
import useAccount from '../../../hooks/scaffold-eth/useAccount'
import useNetwork from '../../../hooks/scaffold-eth/useNetwork'
import { useProfile } from '../../../context/ProfileContext'
import Assets from './modules/wallet/Assets'
import Link, { LinkProps } from './modules/wallet/Link'

let backHandler: NativeEventSubscription;

type WalletProps = {}

function Wallet({ }: WalletProps) {
    const isFocused = useIsFocused()
    const { profile} = useProfile()
    const account = useAccount()
    const network = useNetwork()
    const navigation = useNavigation()

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

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} bgColor={"white"}>
            <StatusBar translucent barStyle={"light-content"} backgroundColor={"transparent"} />

            {/* Profile cover */}
            <View h={WINDOW_HEIGHT * 0.25} zIndex={1} bgColor={"purple.100"}>
                {
                    profile?.backgroundImage && profile.backgroundImage.length > 0 ? (
                        <Image
                            source={{ uri: profile.backgroundImage[0].url.replace("ipfs://", network.ipfsGateway) }}
                            alt="profile cover"
                            w={"full"}
                            h={"full"}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={require("../../../../assets/images/default_profile_cover.jpg")}
                            alt="profile cover"
                            w={"full"}
                            h={"full"}
                            resizeMode="cover"
                        />
                    )
                }

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
                        bgColor={"green.100"}
                    >
                        {
                            profile?.profileImage && profile.profileImage.length > 0 ? (
                                <Image
                                    source={{ uri: profile.profileImage[0].url.replace("ipfs://", network.ipfsGateway) }}
                                    alt="profile image"
                                    w={"full"}
                                    h={"full"}
                                    borderRadius={"full"}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Image
                                    source={require("../../../../assets/images/default_profile_image.jpeg")}
                                    alt="profile image"
                                    w={"full"}
                                    h={"full"}
                                    resizeMode="cover"
                                    borderRadius={"full"}
                                />
                            )
                        }
                        <View
                            position={"absolute"}
                            bottom={0}
                            right={0}
                            borderWidth={3}
                            borderColor={"white"}
                            borderRadius={"full"}
                        >
                            <Blockie address={account.address} size={20} />
                        </View>
                    </View>
                </VStack>
            </View>

                        {/* @ts-ignore */}
            <Pressable onPress={() => navigation.navigate("EditProfile")}>
                <Text
                    alignSelf={"flex-end"}
                    mt={3}
                    mr={2}
                    px={"4"}
                    py={"1"}
                    borderWidth={"1"}
                    borderRadius={"2xl"}
                    borderColor={"gray.300"}
                    fontWeight={"medium"}
                >
                    Edit profile
                </Text>
            </Pressable>


            <VStack px={"2"}>
                {/* Username */}
                <Text color={COLORS.primary} fontSize={FONT_SIZE["xl"] * 1.2} bold>
                    @{profile?.name || "anonymous"}
                </Text>

                {/* Profile address */}
                <CopyableText
                    displayText={truncateAddress(account.address)}
                    value={account.address}
                    textStyle={{ fontSize: FONT_SIZE["xl"], fontWeight: "400", color: "gray" }}
                    iconStyle={{ color: COLORS.primary }}
                />

                {/* Bio */}
                {!!profile?.description && (
                    <Text fontSize={"md"} fontWeight={"normal"} my={2}>
                        {profile.description}
                    </Text>
                )}

                {/* Links */}
                {!!profile?.links && (
                    <HStack flexWrap={"wrap"} space={"2"} mb={1}>
                        {profile.links.map((link: LinkProps) => <Link key={link.url} title={link.title} url={link.url} />)}
                    </HStack>
                )}

                {/* Tags */}
                {!!profile?.tags && (
                    <HStack flexWrap={"wrap"} space={"2"}>
                        {profile.tags.map((tag: string) => (
                            <Text
                                key={tag}
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
                )}
            </VStack>

            <Assets />
        </ScrollView>
    )
}

export default Wallet