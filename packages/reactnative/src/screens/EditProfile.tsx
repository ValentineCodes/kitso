import { ERC725 } from '@erc725/erc725.js';
import LSP3ProfileMetadataSchemas from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
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
  VStack
} from 'native-base';
import React, { useCallback, useState } from 'react';
import { useModal } from 'react-native-modalfy';
import SInfo from 'react-native-sensitive-info';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Blockie from '../components/Blockie';
import Button from '../components/Button';
import LinkInput, { LinkType } from '../components/forms/LinkInput';
import TagInput from '../components/forms/TagInput';
import UsernameInput from '../components/forms/UsernameInput';
import { ImageType } from '../components/modals/ImageCaptureModal';
import { useProfile } from '../context/ProfileContext';
import useAccount from '../hooks/scaffold-eth/useAccount';
import useNetwork from '../hooks/scaffold-eth/useNetwork';
import useImageUploader from '../hooks/useImageUploader';
import { useIPFSGateway } from '../hooks/useIPFSGateway';
import useJSONUploader from '../hooks/useJSONUploader';
import { Controller } from '../hooks/useWallet';
import styles from '../styles/global';
import { WINDOW_WIDTH } from '../styles/screenDimensions';
import { COLORS, STORAGE_KEY } from '../utils/constants';
import { truncateAddress } from '../utils/helperFunctions';
import { FONT_SIZE } from '../utils/styles';

type Props = {};

export default function EditProfile({}: Props) {
  const navigation = useNavigation();
  const toast = useToast();
  const { openModal } = useModal();
  const { profile, fetchProfile } = useProfile();
  const account = useAccount();
  const network = useNetwork();
  const { parseIPFSUrl } = useIPFSGateway();

  const { upload: uploadImage } = useImageUploader({ enabled: false });
  const { upload: uploadProfile } = useJSONUploader({ enabled: false });

  const [username, setUsername] = useState(profile?.name || '');

  const [coverImage, setCoverImage] = useState<ImageType>();
  const [profileImage, setProfileImage] = useState<ImageType>();
  const [bio, setBio] = useState(profile?.description || '');
  const [tags, setTags] = useState<string[]>(profile?.tags || []);
  const [links, setLinks] = useState<({ id: string } & LinkType)[]>(
    profile?.links.map((link, index) => ({ ...link, id: index.toString() })) ||
      []
  );
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
      { id: links.length.toString(), title: '', url: '' }
    ]);
  };

  const removeLink = (id: string) => {
    setLinks(links => links.filter(link => link.id !== id));
  };

  const setLinkTitle = (id: string, title: string) => {
    setLinks(links =>
      links.map(link => {
        if (link.id != id) return link;
        return { ...link, title };
      })
    );
  };

  const setLinkUrl = (id: string, url: string) => {
    setLinks(links =>
      links.map(link => {
        if (link.id != id) return link;
        return { ...link, url };
      })
    );
  };

  const editProfile = async () => {
    try {
      setIsUploading(true);

      // Prepare profile metadata
      const profileMetadata: any = {
        LSP3Profile: {
          name: username,
          description: bio,
          links: links.map(link => ({ title: link.title, url: link.url })),
          tags,
          profileImage: profile?.profileImage || [],
          backgroundImage: profile?.backgroundImage || []
        }
      };

      // Helper function for uploading images and adding to metadata
      const handleImageUpload = async (
        image: any,
        field: string,
        dimensions: { width: number; height: number }
      ) => {
        const uploadedImage = await uploadImage({
          name: image.name,
          type: image.type,
          uri: image.uri
        });

        if (!uploadedImage) {
          toast.show(`Failed to upload ${field} image`, { type: 'danger' });
          setIsUploading(false);
          return false;
        }

        profileMetadata.LSP3Profile[field] = [
          {
            ...dimensions,
            verification: {
              method: 'keccak256(bytes)',
              data: uploadedImage.bufferHash
            },
            url: `ipfs://${uploadedImage.ipfsHash}`
          }
        ];

        return true;
      };

      // Upload profile and cover images
      if (
        profileImage &&
        !(await handleImageUpload(profileImage, 'profileImage', {
          width: 1024,
          height: 1024
        }))
      ) {
        return;
      }

      if (
        coverImage &&
        !(await handleImageUpload(coverImage, 'backgroundImage', {
          width: 1500,
          height: 500
        }))
      ) {
        return;
      }

      // Upload profile metadata
      const _profile = await uploadProfile(profileMetadata);
      if (!_profile) {
        toast.show('Failed to upload profile metadata', { type: 'danger' });
        throw new Error('Failed to upload profile metadata');
      }

      const profileMetadataHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(JSON.stringify(profileMetadata))
      );

      const lsp3DataValue = {
        verification: {
          method: 'keccak256(utf8)',
          data: profileMetadataHash
        },
        url: `ipfs://${_profile.ipfsHash}`
      };

      const provider = new ethers.providers.JsonRpcProvider(network.provider);
      const controller: Controller = JSON.parse(
        await SInfo.getItem('controller', STORAGE_KEY)
      );

      const controllerWallet = new ethers.Wallet(controller.privateKey).connect(
        provider
      );

      const erc725 = new ERC725(
        LSP3ProfileMetadataSchemas as any,
        account.address,
        provider,
        {
          ipfsGateway: network.ipfsGateway
        }
      );

      const universalProfile = new ethers.Contract(
        account.address,
        UniversalProfileContract.abi,
        controllerWallet
      );

      const keyManager = new ethers.Contract(
        account.keyManager,
        KeyManagerContract.abi,
        controllerWallet
      );

      // Encode LSP3 metadata
      const encodedData = erc725.encodeData([
        { keyName: 'LSP3Profile', value: lsp3DataValue }
      ]);

      // Encode setData and execute calls
      const editProfileCalldata = universalProfile.interface.encodeFunctionData(
        'setData',
        [encodedData.keys[0], encodedData.values[0]]
      );

      // Call execute on Key Manager
      const tx = await keyManager.functions.execute(editProfileCalldata, {
        gasLimit: 3000000
      });

      // Wait for confirmation
      await tx.wait();

      // refresh profile
      fetchProfile().catch(error => null);

      toast.show('Profile Updated Successfully!', { type: 'success' });
    } catch (error) {
      toast.show('Failed to edit profile!', { type: 'danger' });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const selectCoverImage = useCallback(() => {
    if (coverImage) {
      return { uri: coverImage.uri };
    } else if (profile?.backgroundImage && profile.backgroundImage.length > 0) {
      return {
        uri: parseIPFSUrl(profile.backgroundImage[0].url)
      };
    } else {
      return require('../../assets/images/default_profile_cover.jpg');
    }
  }, [coverImage, profile]);

  const selectProfileImage = useCallback(() => {
    if (profileImage) {
      return { uri: profileImage.uri };
    } else if (profile?.profileImage && profile.profileImage.length > 0) {
      return {
        uri: parseIPFSUrl(profile.profileImage[0].url)
      };
    } else {
      return require('../../assets/images/default_profile_image.jpeg');
    }
  }, [profileImage, profile]);

  const captureCoverImage = () => {
    openModal('ImageCaptureModal', {
      onCapture: setCoverImage,
      imageDim: {
        width: 1500,
        height: 500
      }
    });
  };

  const captureProfileImage = () => {
    openModal('ImageCaptureModal', {
      onCapture: setProfileImage
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} bgColor={'white'}>
      <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'} />
      {/* Profile cover */}
      <Pressable onPress={captureCoverImage} h={'20%'}>
        <Image
          source={selectCoverImage()}
          alt="profile cover"
          w={'full'}
          h={'full'}
          resizeMode="cover"
        />
        <Pressable
          onPress={() => navigation.goBack()}
          _pressed={{ opacity: 0.4 }}
          position={'absolute'}
          top={8}
          left={4}
          bgColor={'gray.300'}
          borderRadius={'full'}
          p={'1'}
        >
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
            style={{ aspectRatio: 1 }}
            borderRadius={'full'}
            borderWidth={5}
            borderColor={'white'}
            mt={-((WINDOW_WIDTH * 0.25) / 2)}
          >
            <Image
              source={selectProfileImage()}
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
              <Blockie address={account.address} size={20} />
            </View>
          </Pressable>
        </VStack>

        <ScrollView flex={1}>
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
            w={'75%'}
          >
            {truncateAddress(account.address)}
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
                cursorColor: COLORS.primary
              }}
            />
          </VStack>

          {/* Tags */}
          <VStack mt={4}>
            <Text fontSize={'md'} fontWeight={'medium'}>
              Tags
            </Text>

            <TagInput defaultTags={tags} onAdd={addTag} onDelete={removeTag} />
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
        text="Edit profile"
        loading={isUploading}
        onPress={editProfile}
        style={{ marginBottom: 15, width: '95%', alignSelf: 'center' }}
      />
    </ScrollView>
  );
}
