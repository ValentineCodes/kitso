import { Text, View } from 'native-base'
import React from 'react'

type Props = {}

export default function Dashboard({ }: Props) {
    return (
        <View flex={1} justifyContent={"center"} alignItems={"center"} bgColor={"white"}>
            <Text fontSize={"2xl"}>Dashboard</Text>
        </View>
    )
}