import React from 'react'
import NetworkToken from '../../../../../components/cards/tokens/NetworkToken'
import { View } from 'native-base'
import LSP7Token from '../../../../../components/cards/tokens/LSP7Token'

type Props = {}

export default function Tokens({}: Props) {
  return (
    <View flex={"1"} bgColor={"white"} p={2}>
        <NetworkToken />
        <LSP7Token />
    </View>
  )
}