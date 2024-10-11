import { ScrollView } from 'native-base'
import React from 'react'
import LSP8Token from '../../../../../components/cards/tokens/LSP8Token'

type Props = {}

export default function Collectibles({}: Props) {
  return (
    <ScrollView flex={"1"} bgColor={"white"} p={2}>
        <LSP8Token />
    </ScrollView>
  )
}