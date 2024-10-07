import { FlatList, HStack, Pressable, Text, View } from 'native-base'
import React from 'react'
import { FONT_SIZE } from '../../../utils/styles'
import { useSelector } from 'react-redux'
import { COLORS } from '../../../utils/constants'
import { TouchableOpacity } from 'react-native'
import Blockie from '../../../components/Blockie'
import { truncateAddress } from '../../../utils/helperFunctions'

type Props = {
    onSelect: (address: string) => void
}

export default function Recents({onSelect}: Props) {
    const recipients: string[] = useSelector((state: any) => state.recipients)

    return (
        <View flex="1">
            <>
                <HStack alignItems="center" justifyContent="space-between">
                    <Text bold fontSize={FONT_SIZE['xl']}>Recents</Text>
                    <Pressable>
                        <Text color={COLORS.primary} fontSize={FONT_SIZE['lg']} fontWeight="medium">Clear</Text>
                    </Pressable>
                </HStack>

                <FlatList
                    keyExtractor={item => item}
                    data={recipients}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onSelect(item)}>
                            <HStack alignItems="center" space="4" mb="4">
                                <Blockie address={item} size={1.7 * FONT_SIZE['xl']} />
                                <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{truncateAddress(item)}</Text>
                            </HStack>
                        </TouchableOpacity>
                    )}
                />
            </>
        </View>
    )
}