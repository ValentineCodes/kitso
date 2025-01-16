import { FlatList, HStack, Image, Pressable, Text, View } from 'native-base';
import React from 'react';
import Blockie from '../../../components/Blockie';
import { getFirst4Hex, truncateAddress } from '../../../utils/helperFunctions';

type Props = {
  profiles: any[];
  onSelect: (address: string) => void;
};

type ProfileProps = {
  image: string;
  address: string;
  name?: string;
};

function Profile({ image, address, name }: ProfileProps) {
  return (
    <HStack alignItems="center" space={1} mb="4">
      <View
        w="10"
        style={{ aspectRatio: 1 }}
        borderRadius={'full'}
        borderWidth={5}
        borderColor={'white'}
      >
        <Image
          source={require('../../../../assets/images/default_profile_image.jpeg')}
          alt="profile image"
          w={'full'}
          h={'full'}
          resizeMode="cover"
          borderRadius={'full'}
        />
        <View
          position={'absolute'}
          bottom={0}
          right={0}
          borderWidth={3}
          borderColor={'white'}
          borderRadius={'full'}
        >
          <Blockie address={address} size={10} />
        </View>
      </View>

      {name ? (
        <HStack alignItems={'center'}>
          <Text color={'black'} bold fontSize="lg">
            @{name}
          </Text>

          <Text bold color={'gray.400'} fontSize="lg">
            #{getFirst4Hex(address)}
          </Text>
        </HStack>
      ) : (
        <Text color={'black'} bold fontSize="lg">
          @{truncateAddress(address)}
        </Text>
      )}
    </HStack>
  );
}

export default function ProfileSuggestions({ profiles, onSelect }: Props) {
  return (
    <View flex={1}>
      <FlatList
        keyExtractor={item => item}
        data={profiles}
        renderItem={({ item }) => (
          <Pressable onPress={() => onSelect(item)}>
            <Profile
              image="https://img.com"
              address="0x80d898c5a3a0b118a0c8c8adcdbb260fc687f1ce"
              name="valentine"
            />
          </Pressable>
        )}
      />
    </View>
  );
}
