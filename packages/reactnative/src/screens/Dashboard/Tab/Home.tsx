
import { HStack, ScrollView, Text, VStack, View } from 'native-base'
import React from 'react'
// @ts-ignore
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { WINDOW_WIDTH } from '../../../utils/styles'
import { COLORS } from '../../../utils/constants'
import { useNavigation } from '@react-navigation/native'


type Props = {}

function HighlightedText({ children }: { children: string }) {
    return (
        <View bgColor={COLORS.primaryLight} px={"1"}>
            <Text fontSize={"md"} textAlign={"center"}>{children}</Text>
        </View>
    )
}

export default function Home({ }: Props) {
    const navigation = useNavigation()

    return (
        <ScrollView flex={"1"} bgColor={"white"}>
            <VStack px={"2"} py={"8"} alignItems={"center"}>
                <Text fontSize={"2xl"} fontWeight={"light"}>Welcome to</Text>
                <Text fontSize={"4xl"} fontWeight={"bold"}>Kitso</Text>

                <Text fontSize={"lg"} mt={"4"} mb={"1"}>Get started by editing</Text>
                <HighlightedText>packages/reactnative/src/screens/Dashboard/Tab/Home.tsx</HighlightedText>

                <HStack mt={"4"} mb={"1"} space={"1"} maxW={"full"}>
                    <Text fontSize={"lg"}>Edit your smart contract</Text>
                    <HighlightedText>YourContract.sol</HighlightedText>
                    <Text fontSize={"lg"}>in</Text>
                </HStack>
                <HighlightedText>packages/hardhat/contracts</HighlightedText>
            </VStack>

            <View p={"4"} justifyContent={"center"} alignItems={"center"}>
                <VStack px={"4"} py={"8"} w={"80%"} borderWidth={"1"} borderColor={"muted.200"} rounded={"3xl"} alignItems={"center"} space={"6"}>
                    <Ionicons
                        name="bug-outline"
                        color={"grey"}
                        size={WINDOW_WIDTH * 0.08}
                    />

                    <Text textAlign={"center"} fontSize={"lg"}>
                        Tinker with your smart contracts using the
                        {/* @ts-ignore */}
                        <Text underline fontWeight={"medium"} onPress={() => navigation.navigate("DebugContracts")}> DebugContracts </Text>
                        tab</Text>
                </VStack>
            </View>
        </ScrollView>
    )
}