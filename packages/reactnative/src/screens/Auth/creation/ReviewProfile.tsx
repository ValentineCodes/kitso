import React, { useState } from 'react'
import { Icon, Image, Input, Pressable, Text, View, VStack } from 'native-base'
import Ionicons from 'react-native-vector-icons/dist/Ionicons'
import { useNavigation } from '@react-navigation/native'

import styles from "../../../styles/global"
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'
import Button from '../../../components/Button'
import Blockie from '../../../components/Blockie'
import { DEVICE_WIDTH } from '../../../styles/screenDimensions'
import { truncateAddress } from '../../../utils/helperFunctions'

type Props = {}

const profile = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'

export default function ReviewProfile({ }: Props) {
    const navigation = useNavigation()

    const [isUsernameAdded, setIsUsernameAdded] = useState(false);
    const [username, setUsername] = useState("")

    const handleUsernameInput = (value: string) => {
        setUsername(value.toLowerCase())
    }

    const addUsername = () => {
        setIsUsernameAdded(true)
    }

    const createProfile = () => {
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
                    w={DEVICE_WIDTH * 0.25}
                    style={{ aspectRatio: 1 }}
                    borderRadius={"full"}
                    borderWidth={5}
                    borderColor={"white"}
                    mt={-(DEVICE_WIDTH * 0.25 / 2)}
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

                <VStack w={"60%"} mt={"2"}>
                    {/* Username input field */}
                    <Input
                        autoFocus
                        placeholder="username -> spongebob3000"
                        value={username}
                        onChangeText={handleUsernameInput}
                        onSubmitEditing={addUsername}
                        borderRadius="lg"
                        variant="filled"
                        fontSize="md"
                        focusOutlineColor={COLORS.primary}
                        selectTextOnFocus
                        _input={{
                            selectionColor: COLORS.highlight,
                            cursorColor: COLORS.primary,
                        }}
                    />
                </VStack>

                {!!username && <Text textAlign="center" color={COLORS.primary} fontSize={FONT_SIZE["xl"]} bold mt={"2"}>
                    @{username}
                    <Text color={"purple.500"}>#742d</Text>
                </Text>
                }
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