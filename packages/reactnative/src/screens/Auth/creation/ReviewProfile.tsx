import React, { useState } from 'react'
import { Icon, Image, Input, Pressable, Text, View, VStack } from 'native-base'
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons'
import { useNavigation } from '@react-navigation/native'

import styles from "../../../styles/global"
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'
import Button from '../../../components/Button'
import Blockie from '../../../components/Blockie'
import { WINDOW_WIDTH } from '../../../styles/screenDimensions'
import { truncateAddress } from '../../../utils/helperFunctions'
import UsernameEdit from '../../../components/forms/UsernameEdit'

type Props = {}

const profile = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'

export default function ReviewProfile({ }: Props) {
    const navigation = useNavigation()

    const [username, setUsername] = useState("")

    const addUsername = (_username: string) => {
        setUsername(_username)
    }

    const createProfile = () => {
        // @ts-ignore
        navigation.navigate("DeployProfile")
    }

    return (
        <View style={[styles.screenContainer, { padding: 0 }]}>
            {/* Profile cover */}
            <View
                h={"25%"}
            >
                <Image
                    source={require("../../../../assets/images/profile_cover.jpg")}
                    alt="profile cover"
                    w={"full"}
                    h={"full"}
                    resizeMode="cover"
                />
                <Pressable
                    onPress={() => navigation.goBack()}
                    _pressed={{ opacity: 0.4 }}
                    position={"absolute"}
                    top={4}
                    left={4}
                    bgColor={"gray.300"}
                    borderRadius={"full"}
                    p={"1"}
                >
                    <Icon as={<Ionicons name="arrow-back-outline" />} size={1.3 * FONT_SIZE['xl']} color="black" />
                </Pressable>
            </View>

            <VStack
                flex={1}
                bgColor={"white"}
                borderTopRadius={20}
                mt={-5}
                alignItems={"center"}
                p={15}
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
                        source={require("../../../../assets/images/profile_image.jpeg")}
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

                <UsernameEdit
                    value={username}
                    placeholder="username -> spongebob3000"
                    onSubmit={addUsername}
                />

                <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} fontWeight={"medium"} mt={1} my="2" w={"75%"}>
                    {truncateAddress(profile)}
                </Text>

                <VStack
                    flex={1}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Text textAlign="center" fontSize={FONT_SIZE["xl"]} bold>Review your profile</Text>
                    <Text textAlign="center" fontSize={FONT_SIZE["xl"]} mx={5} mt={2}><Text fontWeight={"medium"}>Don't worry</Text> You can add a profile image and cover image later</Text>
                </VStack>

            </VStack>


            <Button text="Got it, create my profile!" onPress={createProfile} style={{ marginBottom: 15, width: "95%", alignSelf: "center" }} />
        </View>
    )
}