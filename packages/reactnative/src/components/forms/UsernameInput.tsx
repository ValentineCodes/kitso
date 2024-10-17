import { HStack, Icon, Input, Pressable, Text, VStack } from 'native-base';
import React, { useState } from 'react';
// @ts-ignore
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
};

export default function UsernameInput({
  value,
  placeholder,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  const [username, setUsername] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleOnChange = (value: string) => {
    // remove spaces
    const formattedValue = value.replace(/\s+/g, '').toLowerCase();
    setUsername(formattedValue);
    onChange?.(formattedValue);
  };

  const handleOnSubmit = () => {
    setIsEditing(false);
    onSubmit?.(username);
  };

  const handleOnCancel = () => {
    setIsEditing(false);
    setUsername(value);
    onCancel?.();
  };

  return (
    <VStack alignItems="center" space={2}>
      {!isEditing && !username && (
        <Pressable
          px={2}
          py={1}
          borderRadius="sm"
          bgColor={'gray.100'}
          onPress={() => setIsEditing(true)}
        >
          <Text color={'gray.500'} fontSize="md" fontWeight="semibold">
            Enter username
          </Text>
        </Pressable>
      )}

      {isEditing && (
        <HStack alignItems="center" space={2}>
          <Icon
            as={<Ionicons name="close-outline" />}
            size={7}
            color="red.400"
            onPress={handleOnCancel}
          />
          <Input
            autoFocus
            placeholder={placeholder}
            value={username}
            onChangeText={handleOnChange}
            onSubmitEditing={handleOnSubmit}
            borderRadius="lg"
            variant="filled"
            fontSize="md"
            w="60%"
            focusOutlineColor={COLORS.primary}
            selectTextOnFocus
            _input={{
              selectionColor: COLORS.highlight,
              cursorColor: COLORS.primary
            }}
            textAlign="center"
          />
          <Icon
            as={<Ionicons name="checkmark-done-outline" />}
            size={5}
            color={COLORS.primary}
            onPress={handleOnSubmit}
          />
        </HStack>
      )}

      {!isEditing && username && (
        <Pressable
          onPress={() => setIsEditing(true)}
          flexDir={'row'}
          alignItems="center"
        >
          <Text
            textAlign="center"
            color={COLORS.primary}
            fontSize={FONT_SIZE.xl}
            bold
            maxW="60%"
          >
            @{username}
          </Text>
          <Icon
            as={<FontAwesome5 name="pen-square" />}
            size={5}
            color={COLORS.primary}
            ml={2}
          />
        </Pressable>
      )}
    </VStack>
  );
}
