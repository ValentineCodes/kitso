import { HStack, ScrollView, Spinner, Text, VStack, View } from 'native-base'
import React from 'react'

import { useDeployedContractInfo } from '../../hooks/scaffold-eth/useDeployedContractInfo'
import useTargetNetwork from '../../hooks/scaffold-eth/useTargetNetwork'
import { COLORS } from '../../utils/constants'
import Address from '../scaffold-eth/Address'
import Balance from '../scaffold-eth/Balance'
import ContractReadMethods from './ContractReadMethods'
import ContractVariables from './ContractVariables'
import ContractWriteMethods from './ContractWriteMethods'

type Props = {
    contractName: string
}

export default function ContractUI({ contractName }: Props) {
    const targetNetwork = useTargetNetwork()
    const { data: deployedContractData, isLoading: isDeployedContractLoading } = useDeployedContractInfo(contractName);

    if (isDeployedContractLoading) {
        return (
            <View mt={"12"}>
                <Spinner color={COLORS.primary} size={"lg"} />
            </View>
        )
    }

    if (!deployedContractData) {
        return (
            <Text fontSize={"xl"} mt={"12"}>
                {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
            </Text>
        )
    }

    return (
        <ScrollView p={"4"} flex={1}>
            <VStack space={1} p={"4"} mb={"6"} rounded={"2xl"} borderWidth={"1"} borderColor={"muted.300"} bgColor={"white"}>
                <Text fontSize={"lg"} fontWeight={"semibold"}>{contractName}</Text>
                <Address address={deployedContractData.address} />
                <HStack space={1} alignItems={"center"}>
                    <Text fontSize={"sm"} fontWeight={"semibold"}>Balance:</Text>
                    <Balance address={deployedContractData.address} />
                </HStack>
                {targetNetwork && (
                    <HStack space={1} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"semibold"}>Network:</Text>
                        <Text color={"blue.400"} fontWeight={"medium"}>{targetNetwork.name}</Text>
                    </HStack>
                )}
            </VStack>

            <VStack bgColor={COLORS.primaryLight} mb={"6"} space={1} p={"4"} rounded={"2xl"} borderWidth={"1"} borderColor={"muted.300"}>
                <ContractVariables deployedContractData={deployedContractData} />
            </VStack>

            <View
                bgColor={COLORS.primaryLight}
                alignSelf={"flex-start"}
                px={"4"}
                py={"1"}
                rounded={"2xl"}
                h={"16"}
            >
                <Text fontSize={"lg"} fontWeight={"semibold"}>Read</Text>
            </View>
            <VStack mb={"6"} zIndex={10} mt={-8} space={1} p={"4"} rounded={"2xl"} borderWidth={"1"} borderColor={"muted.300"} bgColor={"white"}>
                <ContractReadMethods deployedContractData={deployedContractData} />
            </VStack>

            <View
                bgColor={COLORS.primaryLight}
                alignSelf={"flex-start"}
                px={"4"}
                py={"1"}
                rounded={"2xl"}
                h={"16"}
            >
                <Text fontSize={"lg"} fontWeight={"semibold"}>Write</Text>
            </View>
            <VStack bgColor={"white"} zIndex={10} mt={-8} mb={"6"} space={1} p={"4"} rounded={"2xl"} borderWidth={"1"} borderColor={"muted.300"}>
                <ContractWriteMethods deployedContractData={deployedContractData} />
            </VStack>
        </ScrollView>
    )
}