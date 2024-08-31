import { HStack, Icon, Input, Pressable, Text, VStack } from 'native-base'
import React, { useState } from 'react'
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons'

import { COLORS } from '../../utils/constants'
import { FONT_SIZE } from '../../utils/styles'

type Props = {
    defaultTags?: string[]
    placeholder?: string
    onAdd: (tag: string) => void
    onDelete: (tag: string) => void
}

export default function TagInput({ defaultTags, placeholder, onAdd, onDelete }: Props) {
    const [tags, setTags] = useState<string[]>(defaultTags || [])
    const [tag, setTag] = useState("")

    const addTag = () => {
        const newTag = tag.toLowerCase().trim()
        if (!newTag) return
        if (tags.includes(newTag)) {
            setTag("")
            return
        }

        setTags(tags => [...tags, newTag])
        onAdd(newTag)
        setTag("")
    }

    const removeTag = (_tag: string) => {
        setTags(tags => tags.filter(tag => tag !== _tag))
        onDelete(_tag)
    }
    return (
        <VStack mt={2}>
            {/* Tags */}
            <HStack flexWrap={"wrap"} space={"2"}>
                {tags.map((tag: string) => (
                    <Pressable key={tag} onPress={() => removeTag(tag)}>
                        <HStack
                            alignItems={"center"}
                            alignSelf={"flex-start"}
                            space={"2"}
                            mt={2}
                            px={2}
                            py={0.5}
                            borderWidth={"1"}
                            borderRadius={"md"}
                            borderColor={"gray.300"}
                        >
                            <Text
                                fontSize={"sm"}
                                fontWeight={"light"}
                            >
                                {tag}
                            </Text>
                            <Icon
                                as={<Ionicons name="close-outline" />}
                                size={FONT_SIZE['xl']}
                                color="gray.600"
                            />
                        </HStack>
                    </Pressable>
                ))}
            </HStack>

            <Input
                value={tag}
                placeholder={placeholder || ""}
                onChangeText={setTag}
                onSubmitEditing={addTag}
                borderWidth={0}
                borderBottomWidth={1}
                borderRadius="lg"
                variant="outline"
                fontSize="md"
                w={"full"}
                focusOutlineColor={COLORS.primary}
                selectTextOnFocus
                _input={{
                    selectionColor: COLORS.highlight,
                    cursorColor: COLORS.primary,
                }}
                InputRightElement={
                    tag ? (
                        <Pressable onPress={addTag}>
                            <Icon
                                as={<Ionicons name="checkmark-done-circle-outline" />}
                                size={FONT_SIZE['xl'] * 1.4}
                                color={COLORS.primary}
                                mr={"2"}
                            />
                        </Pressable>
                    ) : undefined
                }
            />
        </VStack>
    )
}