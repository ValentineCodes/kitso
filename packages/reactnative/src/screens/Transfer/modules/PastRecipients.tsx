import { FlatList, HStack, Pressable, Text, View } from 'native-base';
import React from 'react';
import { useModal } from 'react-native-modalfy';
import { useDispatch, useSelector } from 'react-redux';
import Blockie from '../../../components/Blockie';
import { clearRecipients } from '../../../store/reducers/Recipients';
import { COLORS } from '../../../utils/constants';
import { truncateAddress } from '../../../utils/helperFunctions';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  onSelect: (recipient: string) => void;
};

export default function PastRecipients({ onSelect }: Props) {
  const { openModal } = useModal();
  const dispatch = useDispatch();
  const recipients: string[] = useSelector((state: any) => state.recipients);

  const seekConsentToClearRecipients = () => {
    openModal('ConsentModal', {
      title: 'Clear Recents!',
      subTitle:
        'This action cannot be reversed. Are you sure you want to go through with this?',
      okText: "Yes, I'm sure",
      cancelText: 'Not really',
      onAccept: () => {
        dispatch(clearRecipients());
      }
    });
  };
  return (
    <View flex="1">
      {recipients.length > 0 && (
        <>
          <HStack alignItems="center" justifyContent="space-between" mb="4">
            <Text bold fontSize={FONT_SIZE['xl']}>
              Recents
            </Text>
            <Pressable onPress={seekConsentToClearRecipients}>
              <Text
                color={COLORS.primary}
                fontSize={FONT_SIZE['lg']}
                fontWeight="medium"
              >
                Clear
              </Text>
            </Pressable>
          </HStack>

          <FlatList
            keyExtractor={item => item}
            data={recipients}
            renderItem={({ item }) => (
              <Pressable onPress={() => onSelect(item)}>
                <HStack alignItems="center" space="4" mb="4">
                  <Blockie address={item} size={1.7 * FONT_SIZE['xl']} />
                  <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">
                    {truncateAddress(item)}
                  </Text>
                </HStack>
              </Pressable>
            )}
          />
        </>
      )}
    </View>
  );
}
