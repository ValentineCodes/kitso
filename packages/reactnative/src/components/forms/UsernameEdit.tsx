import { VStack, Input, View, Text, Pressable, HStack, Icon } from 'native-base'
import React, { useState } from 'react'
import { COLORS } from '../../utils/constants'
import { FONT_SIZE } from '../../utils/styles'
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5"
import Ionicons from "react-native-vector-icons/dist/Ionicons"

type Props = {
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
}

function UsernameEdit({ value, placeholder, onChange, onSubmit, onCancel }: Props) {
  const [username, setUsername] = useState(value)
  const [isEditing, setIsEditing] = useState(false)

  const handleOnChange = (value: string) => {
    setUsername(value.split(" ").join("").toLowerCase())

    if (!onChange) return
    onChange(value)
  }

  const handleOnSubmit = () => {
    setIsEditing(false)

    if (!onSubmit) return
    onSubmit(username)
  }

  const handleOnCancel = () => {
    setIsEditing(false)
    setUsername(value)

    if (!onCancel) return
    onCancel()
  }

  return (
    <VStack alignItems={"center"} space={2}>

      {!isEditing && !username && (
        <Pressable
          px={2}
          py={1}
          borderRadius={"sm"}
          bgColor={COLORS.primaryLight}
          onPress={() => setIsEditing(true)}
        >
          <Text
            color={COLORS.primary}
            fontSize={"md"}
            fontWeight={"semibold"}
          >
            Preferred username
          </Text>
        </Pressable>
      )}

      {/* Username input field */}

      {isEditing && (
        <HStack alignItems="center" space={2}>
          <Icon as={<Ionicons name="close-outline" />} size={7} color="red.400" onPress={handleOnCancel} />
          <Input
            autoFocus
            placeholder={placeholder}
            value={username}
            onChangeText={handleOnChange}
            onSubmitEditing={handleOnSubmit}
            borderRadius="lg"
            variant="filled"
            fontSize="md"
            w={"60%"}
            focusOutlineColor={COLORS.primary}
            selectTextOnFocus
            _input={{
              selectionColor: COLORS.highlight,
              cursorColor: COLORS.primary,
            }}
            textAlign={"center"}
          />
          <Icon as={<Ionicons name="checkmark-done-outline" />} size={5} color={COLORS.primary} onPress={handleOnSubmit} />
        </HStack>
      )}

      {/* username */}
      {!isEditing && username && (
        <HStack alignItems={"center"} space={2}>
          <Text textAlign="center" color={COLORS.primary} fontSize={FONT_SIZE["xl"]} bold maxW={"60%"}>
            @{username}
          </Text>

          <Icon as={<FontAwesome5 name="pen-square" />} size={5} color={COLORS.primary} onPress={() => setIsEditing(true)} />
        </HStack>
      )
      }
    </VStack>
  )
}

export default UsernameEdit