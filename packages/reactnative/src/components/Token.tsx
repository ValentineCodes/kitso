import { VStack, HStack, View, Image, Text, Pressable } from 'native-base'
import React from 'react'
import useNetwork from '../hooks/scaffold-eth/useNetwork'
import { WINDOW_WIDTH } from '../utils/styles'
import useBalance from '../hooks/scaffold-eth/useBalance'
import useAccount from '../hooks/scaffold-eth/useAccount'

type Props = {}

export default function Token({ }: Props) {
    const network = useNetwork()
    const account = useAccount()
    const { balance, isRefetching, refetch } = useBalance({ address: account.address })

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
                <View
                    borderWidth={1}
                    borderRadius={"full"}
                    borderColor={"gray.200"}
                    w={WINDOW_WIDTH * 0.17}
                    h={WINDOW_WIDTH * 0.17}
                    p={3}
                >
                    <Image
                        source={require("../../assets/images/lukso_logo.png")}
                        alt="LYX token"
                        w={"full"}
                        h={"full"}
                    />
                </View>

                <VStack space={0.2}>
                    <Text
                        fontSize={"sm"}
                        bold
                    >
                        {network.name.toUpperCase()}
                    </Text>

                    <HStack alignItems={"center"} space={2}>
                        <Text fontSize={"2xl"} bold>{balance !== '' && balance}</Text>
                        <Text fontSize={"md"} bold color={"gray.400"}>{network.token}</Text>
                    </HStack>
                    <Text
                        fontSize={"sm"}
                        fontWeight={"medium"}
                        color={"gray.600"}
                    >
                        $0.00
                    </Text>
                </VStack>
            </HStack>

            <Pressable>
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
                    Buy
                </Text>
            </Pressable>
        </VStack>
    )
}