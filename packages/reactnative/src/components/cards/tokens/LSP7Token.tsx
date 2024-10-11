import { VStack, HStack, View, Image, Text, Pressable } from 'native-base'
import React from 'react'
import { WINDOW_WIDTH } from '../../../utils/styles'
import Blockie from '../../Blockie'
import { useNavigation } from '@react-navigation/native'
import { getFirstSixHex } from '../../../utils/helperFunctions'

type Props = {}

export default function LSP7Token({ }: Props) {
const navigation = useNavigation()

    return (
        <VStack
            borderWidth={"1"}
            borderRadius={"2xl"}
            borderColor={"gray.200"}
            pt={"8"}
            pb={"4"}
            pl={"6"}
            pr={"4"}
        >
            <HStack
                space={"6"}
            >
                <VStack alignItems={"center"} space={2}>
                    {/* Profile image */}
                    <Pressable>
                        <Image
                            source={require("../../../../assets/images/lukso_logo.png")}
                            alt="LSP7 token"
                            w={WINDOW_WIDTH * 0.17}
                            h={WINDOW_WIDTH * 0.17}
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
                            <Blockie address={"0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce"} size={20} />
                        </View>
                    </Pressable>

                    <Text fontWeight={"semibold"} color={"gray.400"}>#{getFirstSixHex("0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce")}</Text>
                </VStack>

                <VStack space={0.2}>
                    <Text
                        fontSize={"sm"}
                        bold
                    >
                        Just a Potato 🥔
                    </Text>

                    <HStack alignItems={"center"} space={2}>
                        <Text fontSize={"2xl"} bold>1</Text>
                        <Text fontSize={"md"} bold color={"gray.400"}>POTATO</Text>
                    </HStack>
                </VStack>
            </HStack>

            {/* @ts-ignore */}
            <Pressable onPress={() => navigation.navigate("Transfer")}>
                <Text
                    alignSelf={"flex-end"}
                    mt={3}
                    px={"4"}
                    py={"1"}
                    borderWidth={"1"}
                    borderRadius={"2xl"}
                    borderColor={"gray.300"}
                    fontWeight={"medium"}
                >
                    Send
                </Text>
            </Pressable>

            <Text position={"absolute"} top={4} right={4} bg={"purple.100"} borderRadius={"md"} fontSize={"xs"} px={2} py={1}>
                LSP7
            </Text>
        </VStack>
    )
}