import { Divider, HStack, Icon, Image, Pressable, Text, View, VStack } from 'native-base'
import React from 'react'
// @ts-ignore
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { WINDOW_WIDTH } from '../../../utils/styles'
import Blockie from '../../Blockie'
import { COLORS } from '../../../utils/constants'
import { truncateAddress } from '../../../utils/helperFunctions'

type Props = {}

const Creators = () => {
    return (
        <HStack mt={3} alignItems={"center"} justifyContent={"space-between"}>
            <HStack alignItems={"center"} space={2}>
                <Pressable>
                    <Image
                        source={require("../../../../assets/images/default_profile_image.jpeg")}
                        alt="LSP7 token"
                        w={WINDOW_WIDTH * 0.1}
                        h={WINDOW_WIDTH * 0.1}
                        rounded={"full"}
                    />
                    <View
                        position={"absolute"}
                        bottom={0}
                        right={0}
                        borderWidth={3}
                        borderColor={"white"}
                        borderRadius={"full"}
                    >
                        <Blockie address={"0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce"} size={15} />
                    </View>
                </Pressable> 

                <VStack>
                    <Text bold color={"gray.400"} fontSize={"xs"}>Created by</Text>
                    <HStack alignItems={"center"}>
                        <Text color={"black"} bold>
                            @edthedrunk
                        </Text>

                        <Text bold color={"gray.400"}>#d874</Text>
                    </HStack>
                </VStack>
            </HStack>

            <Icon as={<Ionicons name="checkmark-circle" />} size={5} color={COLORS.primary} />
        </HStack>
    )
}

export default function LSP8Token({}: Props) {
  return (
    <VStack
        borderWidth={"1"}
        rounded={"xl"}
        borderColor={"gray.200"}
    >
         <Image
            source={require("../../../../assets/images/default_profile_cover.jpg")}
            alt="LSP7 token"
            w={WINDOW_WIDTH}
            h={WINDOW_WIDTH}
            resizeMode='cover'
            roundedTop={"xl"}
        />

        <VStack
            p={4}
        >
            <HStack space={1.5} alignItems={"center"}>
                <Text bold fontSize={"md"}>Burnt Pix</Text>
                <Text bold color={"gray.400"}>BPix</Text>
            </HStack>

            <HStack space={1.5} alignItems={"center"}>
                <Text bold fontSize={"xs"}>Owns</Text>
                <Text bold fontSize={"xs"}>42</Text>
            </HStack>

            <Creators />

            <Pressable>
                <Text
                    alignSelf={"flex-end"}
                    mt={4}
                    px={"4"}
                    py={"1"}
                    borderWidth={"1"}
                    borderRadius={"lg"}
                    borderColor={"gray.300"}
                    fontWeight={"medium"}
                >
                    Send
                </Text>
            </Pressable>

            <Divider my={4} />

            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <Text bg={"purple.100"} borderRadius={"md"} fontSize={"xs"} px={2} py={1}>
                    LSP8 COLLECTION
                </Text>

                <HStack alignItems={"center"} space={"2"}>
                    <Blockie address={"0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce"} size={15} />    
                    <Text bold color={"gray.400"}>{truncateAddress("0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce")}</Text>
                </HStack>
            </HStack>
        </VStack>
    </VStack>
  )
}