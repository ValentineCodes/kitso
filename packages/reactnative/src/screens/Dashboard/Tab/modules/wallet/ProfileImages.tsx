import { Image, View, VStack } from 'native-base';
import React from 'react';
import Blockie from '../../../../../components/Blockie';
import useAccount from '../../../../../hooks/scaffold-eth/useAccount';
import { useIPFSGateway } from '../../../../../hooks/useIPFSGateway';
import { WINDOW_WIDTH } from '../../../../../utils/styles';

type ProfileImageProps = {
  coverImageURL: string | null;
  profileImageURL: string | null;
};

export default function ProfileImages({
  coverImageURL,
  profileImageURL
}: ProfileImageProps) {
  const account = useAccount();
  const { parseIPFSUrl } = useIPFSGateway();

  return (
    <View h="25%" zIndex={1} bgColor={'purple.100'}>
      {coverImageURL ? (
        <Image
          source={{ uri: parseIPFSUrl(coverImageURL) }}
          alt="profile cover"
          w={'full'}
          h={'full'}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require('../../../../../../assets/images/default_profile_cover.jpg')}
          alt="profile cover"
          w={'full'}
          h={'full'}
          resizeMode="cover"
        />
      )}

      {/* Profile image */}
      <VStack
        position={'absolute'}
        left={'4'}
        bottom={-((WINDOW_WIDTH * 0.2) / 2)}
        alignItems={'flex-start'}
      >
        <View
          w={WINDOW_WIDTH * 0.2}
          style={{ aspectRatio: 1 }}
          borderRadius={'full'}
          borderWidth={5}
          borderColor={'white'}
          bgColor={'green.100'}
        >
          {profileImageURL ? (
            <Image
              source={{ uri: parseIPFSUrl(profileImageURL) }}
              alt="profile image"
              w={'full'}
              h={'full'}
              borderRadius={'full'}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../../../../../../assets/images/default_profile_image.jpeg')}
              alt="profile image"
              w={'full'}
              h={'full'}
              resizeMode="cover"
              borderRadius={'full'}
            />
          )}
          <View
            position={'absolute'}
            bottom={0}
            right={0}
            borderWidth={3}
            borderColor={'white'}
            borderRadius={'full'}
          >
            <Blockie address={account.address} size={20} />
          </View>
        </View>
      </VStack>
    </View>
  );
}
