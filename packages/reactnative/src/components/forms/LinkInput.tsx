import { HStack, Icon, Input } from 'native-base';
import React, { useState } from 'react';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { COLORS } from '../../utils/constants';

export type LinkType = {
  title: string;
  url: string;
};
type Props = {
  title?: string;
  url?: string;
  onChangeTitle?: (title: string) => void;
  onChangeUrl?: (url: string) => void;
  onSubmit?: (link: LinkType) => void;
  onCancel?: () => void;
};

function LinkInput({
  title,
  url,
  onChangeTitle,
  onChangeUrl,
  onSubmit,
  onCancel
}: Props) {
  const [titleValue, setTitleValue] = useState(title || '');
  const [urlValue, setUrlValue] = useState(url || '');

  const handleOnChangeTitle = (value: string) => {
    setTitleValue(value);

    if (!onChangeTitle) return;
    onChangeTitle(value);
  };

  const handleOnChangeUrl = (value: string) => {
    setUrlValue(value);

    if (!onChangeUrl) return;
    onChangeUrl(value);
  };

  const handleOnSubmit = () => {
    if (!onSubmit) return;
    const link = {
      title: titleValue,
      url: urlValue
    };
    onSubmit(link);
  };

  const handleOnCancel = () => {
    if (!onCancel) return;
    onCancel();
  };

  return (
    <HStack
      alignItems={'center'}
      justifyContent={'space-between'}
      mt={2}
      w={'95%'}
    >
      <Input
        value={titleValue}
        placeholder="Title"
        onChangeText={handleOnChangeTitle}
        onSubmitEditing={handleOnSubmit}
        borderWidth={0}
        borderBottomWidth={1}
        borderRadius="lg"
        variant="outline"
        fontSize="md"
        w={'30%'}
        focusOutlineColor={COLORS.primary}
        selectTextOnFocus
        _input={{
          selectionColor: COLORS.highlight,
          cursorColor: COLORS.primary
        }}
      />
      <Input
        value={urlValue}
        placeholder="Link"
        onChangeText={handleOnChangeUrl}
        onSubmitEditing={handleOnSubmit}
        borderWidth={0}
        borderBottomWidth={1}
        borderRadius="lg"
        variant="outline"
        fontSize="md"
        w={'60%'}
        focusOutlineColor={COLORS.primary}
        selectTextOnFocus
        _input={{
          selectionColor: COLORS.highlight,
          cursorColor: COLORS.primary
        }}
      />

      <Icon
        as={<Ionicons name="close-outline" />}
        size={7}
        color="red.400"
        onPress={handleOnCancel}
      />
    </HStack>
  );
}

export default LinkInput;
