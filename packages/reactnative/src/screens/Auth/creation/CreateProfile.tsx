import React, { useState } from 'react'
import { Icon, Image, Input, Pressable, StatusBar, Text, View, VStack } from 'native-base'
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
import ImageCaptureModal, { ImageType } from '../../../components/modals/ImageCaptureModal'

type Props = {}

const profile = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'

export default function CreateProfile({ }: Props) {
    const navigation = useNavigation()

    const [username, setUsername] = useState("")

    const [isCapturingCoverImage, setIsCapturingCoverImage] = useState(false)
    const [isCapturingProfileImage, setIsCapturingProfileImage] = useState(false)
    const [coverImage, setCoverImage] = useState<ImageType>()
    const [profileImage, setProfileImage] = useState<ImageType>()
    const [bio, setBio] = useState("")

    const addUsername = (_username: string) => {
        setUsername(_username)
    }

    const createProfile = () => {
        // @ts-ignore
        navigation.navigate("DeployProfile")
    }

    return (
        <View style={[styles.screenContainer, { padding: 0 }]}>
            <StatusBar translucent backgroundColor={"rgba(0,0,0,0)"} />
            {/* Profile cover */}
            <Pressable
                onPress={() => setIsCapturingCoverImage(true)}
                h={"25%"}
            >
                <Image
                    source={coverImage ?
                        { uri: coverImage.uri }
                        :
                        require("../../../../assets/images/default_profile_cover.jpg")
                    }
                    alt="profile cover"
                    w={"full"}
                    h={"full"}
                    resizeMode="cover"
                />
                <Pressable
                    onPress={() => navigation.goBack()}
                    _pressed={{ opacity: 0.4 }}
                    position={"absolute"}
                    top={12}
                    left={4}
                    bgColor={"gray.300"}
                    borderRadius={"full"}
                    p={"1"}
                >
                    <Icon as={<Ionicons name="arrow-back-outline" />} size={1.3 * FONT_SIZE['xl']} color="black" />
                </Pressable>
            </Pressable>

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
                        source={
                            profileImage ?
                                { uri: profileImage.uri }
                                :
                                require("../../../../assets/images/default_profile_image.jpeg")
                        }
                        alt="profile image"
                        w={"full"}
                        h={"full"}
                        resizeMode="cover"
                        borderRadius={"full"}
                    />
                    <Pressable
                        onPress={() => setIsCapturingProfileImage(true)}
                        position={"absolute"}
                        bottom={0}
                        right={0}
                        borderWidth={3}
                        borderColor={"white"}
                        borderRadius={"full"}
                    >
                        <Blockie address={profile} size={20} />
                    </Pressable>
                </View>

                <UsernameEdit
                    value={username}
                    placeholder="username -> spongebob3000"
                    onSubmit={addUsername}
                />

                <Text textAlign="center" alignSelf={"center"} fontSize={FONT_SIZE['lg']} fontWeight={"medium"} mt={1} my="2" w={"75%"}>
                    {truncateAddress(profile)}
                </Text>

                <VStack>
                    <Text fontSize={"md"} fontWeight={"medium"}>Bio</Text>
                    <Input
                        multiline
                        value={bio}
                        onChangeText={setBio}
                        onSubmitEditing={() => null}
                        borderWidth={0}
                        borderBottomWidth={1}
                        borderRadius="lg"
                        variant="outline"
                        fontSize="md"
                        w={"95%"}
                        focusOutlineColor={COLORS.primary}
                        selectTextOnFocus
                        _input={{
                            selectionColor: COLORS.highlight,
                            cursorColor: COLORS.primary,
                        }}
                    />
                </VStack>

                <VStack
                    flex={1}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Text textAlign="center" fontSize={FONT_SIZE["xl"]} bold>Review your profile</Text>
                    <Text textAlign="center" fontSize={FONT_SIZE["xl"]} mx={5} mt={2}><Text fontWeight={"medium"}>Don't worry!</Text> You can do all this later</Text>
                </VStack>

            </VStack>


            <Button text="Got it, create my profile!" onPress={createProfile} style={{ marginBottom: 15, width: "95%", alignSelf: "center" }} />

            {/* Modals */}
            <ImageCaptureModal
                isOpen={isCapturingCoverImage}
                onClose={() => setIsCapturingCoverImage(false)}
                onCapture={setCoverImage}
            />

            <ImageCaptureModal
                isOpen={isCapturingProfileImage}
                onClose={() => setIsCapturingProfileImage(false)}
                onCapture={setProfileImage}
            />
        </View>
    )
}