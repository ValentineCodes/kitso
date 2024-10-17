import { Input, View } from 'native-base';
import React, { useCallback } from 'react';
import { COLORS } from '../../../utils/constants';
import { CommonInputProps } from './utils';

type Props<T> = CommonInputProps<T> & {
  error?: boolean;
  prefix?: JSX.Element | false;
  suffix?: JSX.Element | false;
};

export default function InputBase<
  T extends { toString: () => string } | undefined = string
>({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  prefix,
  suffix
}: Props<T>) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value as unknown as T);
    },
    [onChange]
  );

  return (
    <View>
      <Input
        value={value?.toString()}
        borderRadius={'3xl'}
        variant="filled"
        fontSize="md"
        mt={'1'}
        focusOutlineColor={COLORS.primary}
        _input={{
          selectionColor: COLORS.primary,
          cursorColor: COLORS.primary
        }}
        cursorColor={COLORS.primary}
        isDisabled={disabled}
        placeholder={placeholder}
        onChangeText={handleChange}
        InputLeftElement={prefix}
        InputRightElement={suffix}
      />
    </View>
  );
}
