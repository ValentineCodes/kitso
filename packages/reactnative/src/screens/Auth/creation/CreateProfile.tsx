import React, {useState} from 'react';
import {
  HStack,
  Icon,
  Image,
  Input,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  VStack,
} from 'native-base';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {useNavigation} from '@react-navigation/native';

import styles from '../../../styles/global';
import {COLORS} from '../../../utils/constants';
import {FONT_SIZE} from '../../../utils/styles';
import Button from '../../../components/Button';
import Blockie from '../../../components/Blockie';
import {WINDOW_WIDTH} from '../../../styles/screenDimensions';
import {truncateAddress} from '../../../utils/helperFunctions';
import UsernameInput from '../../../components/forms/UsernameInput';
import {ImageType} from '../../../components/modals/ImageCaptureModal';
import LinkInput, {LinkType} from '../../../components/forms/LinkInput';
import useImageUploader from '../../../hooks/useImageUploader';
import {useToast} from 'react-native-toast-notifications';
import useJSONUploader from '../../../hooks/useJSONUploader';
import {ethers} from 'ethers';
import TagInput from '../../../components/forms/TagInput';
import {useModal} from 'react-native-modalfy';

type Props = {};

const profile = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

export default function CreateProfile({}: Props) {
  const navigation = useNavigation();
  const toast = useToast();
  const {openModal} = useModal();

  const {upload: uploadImage} = useImageUploader({enabled: false});
  const {upload: uploadProfile} = useJSONUploader({enabled: false});

  const [username, setUsername] = useState('');

  const [coverImage, setCoverImage] = useState<ImageType>();
  const [profileImage, setProfileImage] = useState<ImageType>();
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState<({id: string} & LinkType)[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addUsername = (_username: string) => {
    setUsername(_username);
  };

  const addTag = (_tag: string) => {
    setTags(tags => [...tags, _tag]);
  };

  const removeTag = (_tag: string) => {
    setTags(tags => tags.filter(tag => tag !== _tag));
  };

  const addLink = () => {
    setLinks(links => [
      ...links,
      {id: links.length.toString(), title: '', url: ''},
    ]);
  };

  const removeLink = (id: string) => {
    setLinks(links => links.filter(link => link.id !== id));
  };

  const setLinkTitle = (id: string, title: string) => {
    setLinks(links =>
      links.map(link => {
        if (link.id != id) return link;
        return {...link, title};
      }),
    );
  };

  const setLinkUrl = (id: string, url: string) => {
    setLinks(links =>
      links.map(link => {
        if (link.id != id) return link;
        return {...link, url};
      }),
    );
  };

  const createProfile = async () => {
    try {
      setIsUploading(true);

      let profileMetadata = {
        LSP3Profile: {
          name: username,
          description: bio,
          links: links.map(link => ({title: link.title, url: link.url})),
          tags: tags,
          profileImage: [] as any,
          backgroundImage: [] as any,
        },
      };

      if (profileImage) {
        // upload profile image
        const _profileImage = await uploadImage({
          name: profileImage.name,
          type: profileImage.type,
          uri: profileImage.uri,
        });

        if (!_profileImage) {
          toast.show('Failed to upload profile image', {type: 'danger'});
          return;
        }

        profileMetadata.LSP3Profile.profileImage.push({
          width: 1024,
          height: 1024,
          verification: {
            method: 'keccak256(bytes)',
            data: _profileImage.bufferHash,
          },
          url: `ipfs://${_profileImage.ipfsHash}`,
        });
      }

      if (coverImage) {
        // upload cover image
        const _coverImage = await uploadImage({
          name: coverImage.name,
          type: coverImage.type,
          uri: coverImage.uri,
        });

        if (!_coverImage) {
          toast.show('Failed to upload cover image', {type: 'danger'});
          return;
        }

        profileMetadata.LSP3Profile.backgroundImage.push({
          width: 1024,
          height: 1024,
          verification: {
            method: 'keccak256(bytes)',
            data: _coverImage.bufferHash,
          },
          url: `ipfs://${_coverImage.ipfsHash}`,
        });
      }

      const profile = await uploadProfile(profileMetadata);

      if (!profile) {
        toast.show('Failed to upload profile metadata', {type: 'danger'});
        return;
      }

      const profileMetadataHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(JSON.stringify(profileMetadata)),
      );

      const lsp3DataValue = {
        verification: {
          method: 'keccak256(utf8)',
          data: profileMetadataHash,
        },
        // this is an IPFS CID of a LSP3 Profile Metadata example, you can use your own
        url: `ipfs://${profile.ipfsHash}`,
      };

      // @ts-ignore
      navigation.navigate('DeployProfile', {
        lsp3DataValue,
      });
    } catch (error) {
      toast.show('Failed to create profile!', {type: 'danger'});
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const captureCoverImage = () => {
    openModal('ImageCaptureModal', {
      onCapture: setCoverImage,
    });
  };

  const captureProfileImage = () => {
    openModal('ImageCaptureModal', {
      onCapture: setProfileImage,
    });
  };

  return (
    <View style={[styles.screenContainer, {padding: 0}]}>
      <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'} />
      {/* Profile cover */}
      <Pressable onPress={captureCoverImage} h={'25%'}>
        <Image
          source={
            coverImage
              ? {uri: coverImage.uri}
              : require('../../../../assets/images/default_profile_cover.jpg')
          }
          alt="profile cover"
          w={'full'}
          h={'full'}
          resizeMode="cover"
        />
        <Pressable
          onPress={() => navigation.goBack()}
          _pressed={{opacity: 0.4}}
          position={'absolute'}
          top={8}
          left={4}
          bgColor={'gray.300'}
          borderRadius={'full'}
          p={'1'}>
          <Icon
            as={<Ionicons name="arrow-back-outline" />}
            size={1.3 * FONT_SIZE['xl']}
            color="black"
          />
        </Pressable>
      </Pressable>

      <VStack flex={1} bgColor={'white'} borderTopRadius={20} mt={-5} p={15}>
        <VStack alignItems={'center'}>
          {/* Profile image */}
          <Pressable
            onPress={captureProfileImage}
            w={WINDOW_WIDTH * 0.25}
            style={{aspectRatio: 1}}
            borderRadius={'full'}
            borderWidth={5}
            borderColor={'white'}
            mt={-((WINDOW_WIDTH * 0.25) / 2)}>
            <Image
              source={
                profileImage
                  ? {uri: profileImage.uri}
                  : require('../../../../assets/images/default_profile_image.jpeg')
              }
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
              borderRadius={'full'}>
              <Blockie address={profile} size={20} />
            </View>
          </Pressable>
        </VStack>

        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
          <UsernameInput
            value={username}
            placeholder="spongebob911"
            onSubmit={addUsername}
          />

          <Text
            textAlign="center"
            alignSelf={'center'}
            fontSize={FONT_SIZE['lg']}
            fontWeight={'medium'}
            mt={1}
            my="2"
            w={'75%'}>
            {truncateAddress(profile)}
          </Text>

          <VStack>
            <Text fontSize={'md'} fontWeight={'medium'}>
              Bio
            </Text>
            <Input
              multiline
              value={bio}
              placeholder="Tell me about yourself"
              onChangeText={setBio}
              onSubmitEditing={() => null}
              borderWidth={0}
              borderBottomWidth={1}
              borderRadius="lg"
              variant="outline"
              fontSize="md"
              w={'95%'}
              focusOutlineColor={COLORS.primary}
              selectTextOnFocus
              _input={{
                selectionColor: COLORS.highlight,
                cursorColor: COLORS.primary,
              }}
            />
          </VStack>

          {/* Tags */}
          <VStack mt={4}>
            <Text fontSize={'md'} fontWeight={'medium'}>
              Tags
            </Text>

            <TagInput onAdd={addTag} onDelete={removeTag} />
          </VStack>

          {/* Links */}
          <VStack mt={4}>
            <HStack alignItems={'center'} space={2}>
              <Text fontSize={'md'} fontWeight={'medium'}>
                Links
              </Text>

              <Icon
                as={<Ionicons name="add-outline" />}
                size={5}
                color={COLORS.primary}
                onPress={addLink}
                bgColor={COLORS.primaryLight}
              />
            </HStack>

            {links.map(link => (
              <LinkInput
                key={link.id}
                title={link.title}
                url={link.url}
                onCancel={() => removeLink(link.id)}
                onChangeTitle={title => setLinkTitle(link.id, title)}
                onChangeUrl={url => setLinkUrl(link.id, url)}
              />
            ))}
          </VStack>
        </ScrollView>
      </VStack>

      <Button
        text="Got it, create my profile!"
        loading={isUploading}
        onPress={createProfile}
        style={{marginBottom: 15, width: '95%', alignSelf: 'center'}}
      />
    </View>
  );
}
