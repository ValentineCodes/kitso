import React, { useState } from 'react'
import { Divider, Image, ScrollView, Text, View, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { useToast } from 'react-native-toast-notifications';

import styles from "../../../styles/global"
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'
import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader'
import Button from '../../../components/Button';
import { WINDOW_WIDTH } from '../../../styles/screenDimensions';
import { truncateAddress } from '../../../utils/helperFunctions';
import Blockie from '../../../components/Blockie';

type Props = {}
type ProfileProps = {
    address: string;
    username?: string;
    image?: any;
    cover?: any;
}

const profile = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
const Profile = ({ address, username, image, cover }: ProfileProps) => {

    const recover = () => {

    }
    return (
        <View
            bgColor={"white"}
            borderWidth={1}
            borderColor={"gray.200"}
            borderRadius={15}
            mb={"4"}
        >
            {/* Profile cover */}
            <Image
                source={require("../../../../assets/images/default_profile_cover.jpg")}
                alt="profile cover"
                w={"full"}
                h={WINDOW_WIDTH * 0.4}
                resizeMode="cover"
                borderTopRadius={15}
            />

            <VStack
                flex={1}
                bgColor={"white"}
                borderTopRadius={20}
                mt={-5}
                p={15}
                alignItems={"center"}
            >
                {/* Profile image */}
                <View
                    w={WINDOW_WIDTH * 0.25}
                    style={{ aspectRatio: 1 }}
                    borderRadius={"full"}
                    borderWidth={5}
                    borderColor={"white"}
                    mt={-(WINDOW_WIDTH * 0.25 / 2)}
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
                        <Blockie address={profile} size={20} />
                    </View>
                </View>

                <Text textAlign="center" color={COLORS.primary} fontSize={FONT_SIZE["xl"]} bold mt={"2"}>
                    @{username}
                    <Text color={"purple.500"}>#742d</Text>
                </Text>

                <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} fontWeight={"medium"} mt={1} my="2" w={"75%"}>
                    {truncateAddress(address)}
                </Text>
            </VStack>


            <Button text="Recover" type='outline' onPress={recover} style={{ marginBottom: 15, width: "95%", alignSelf: "center" }} />
        </View>
    )
}

export default function RecoverProfile({ }: Props) {
    const navigation = useNavigation()
    const toast = useToast()

    const recover = () => {
        navigation.navigate("CreatePassword")
    }

    return (
        <View style={styles.screenContainer}>
            <ProgressIndicatorHeader progress={3} steps={4} />

            <Divider bgColor="muted.100" my="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize={1.4 * FONT_SIZE["xl"]} bold mb={"4"}>Your Profiles</Text>

            <ScrollView flex={1}>
                <VStack
                    space={6} mb="26" mt="4"
                >
                    <Profile address={profile} username='spongebob3000' />
                    <Profile address={profile} username='spongebob3000' />
                    <Profile address={profile} username='spongebob3000' />
                </VStack>
            </ScrollView>

            <Button text="Recover" onPress={recover} style={{ marginBottom: 15 }} />
        </View>
    )
}