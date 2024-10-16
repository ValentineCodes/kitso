import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import lsp4MetadataSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import useAccount from '../hooks/scaffold-eth/useAccount';
import useNetwork from '../hooks/scaffold-eth/useNetwork';

// Types for LSP4Metadata
interface LSP4Metadata {
  assets: Asset[]; // Array of assets
  backgroundImage: Image[]; // Array of images
  description: string; // Description of the asset
  icon: Image[]; // Array of icon images
  images: Image[]; // Additional images
  links: Link[]; // Array of links related to the asset
  name: string; // Name of the asset
}

// Types for Asset (can be defined based on its structure)
interface Asset {
  // Define the properties of Asset based on its structure
  // For example:
  // id: string;
  // type: string;
}

// Types for Image
interface Image {
  width: number; // Width of the image
  height: number; // Height of the image
  hashFunction: string; // Hash function used for the image
  hash: string; // Hash of the image
  url: string; // URL of the image
}

// Types for Link
interface Link {
  title: string; // Title of the link
  url: string; // URL of the link
}

// Type for the overall response
interface LSP4Response {
  dynamicName: string; // Dynamic name
  key: string; // Key of the metadata
  name: string; // Name of the metadata
  value: {
    LSP4Metadata: LSP4Metadata; // Nested LSP4Metadata object
  };
}

// Profile Types
interface Profile {
  name: string;
  description: string;
  tags: string[];
  links: Link[];
  profileImage: Image[];
  backgroundImage: Image[];
}

interface AssetMetadata {
  address: string;
  name: string;
  symbol: string;
  image: string | null;
  type: 'LSP7' | 'LSP8' | 'LSP8 COLLECTION';
}

interface UseProfileResult {
  profile: Profile | null;
  lsp12IssuedAssets: AssetMetadata[]; // Combined storage for LSP7 and LSP8 assets
  lsp5ReceivedAssets: AssetMetadata[];
  isFetchingAssets: boolean;
  isFetchingProfile: boolean;
  fetchProfile: () => Promise<Profile | null>;
  fetchAssets: () => Promise<{
    lsp12IssuedAssets: AssetMetadata[];
    lsp5ReceivedAssets: AssetMetadata[];
  }>;
}

interface ProfileProviderProps {
  children: ReactNode;
}

// Create Profile Context
const ProfileContext = createContext<UseProfileResult | undefined>(undefined);

const TOKEN_TYPES = ['LSP7', 'LSP8', 'LSP8 COLLECTION'];

// Profile Provider Component
export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children
}) => {
  const account = useAccount();
  const network = useNetwork();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lsp12IssuedAssets, setLsp12IssuedAssets] = useState<AssetMetadata[]>(
    []
  );
  const [lsp5ReceivedAssets, setLsp5ReceivedAssets] = useState<AssetMetadata[]>(
    []
  );
  const [isFetchingAssets, setIsFetchingAssets] = useState<boolean>(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState<boolean>(false);

  // Fetch profile data
  const fetchProfile = useCallback(async (): Promise<Profile | null> => {
    if (!account?.isConnected) {
      setProfile(null);
      return null;
    }

    const erc725js = new ERC725(
      lsp3ProfileSchema as ERC725JSONSchema[],
      account.address,
      network.provider,
      { ipfsGateway: network.ipfsGateway }
    );

    try {
      setIsFetchingProfile(true);
      const profileMetaData = await erc725js.fetchData('LSP3Profile');
      if (
        profileMetaData.value &&
        typeof profileMetaData.value === 'object' &&
        'LSP3Profile' in profileMetaData.value
      ) {
        const fetchedProfile = profileMetaData.value.LSP3Profile;
        setProfile(fetchedProfile);
        return fetchedProfile;
      }
    } catch (error) {
      console.error('Cannot fetch universal profile data:', error);
    } finally {
      setIsFetchingProfile(false);
    }

    return null;
  }, [account, network]);

  // Fetch Assets (LSP7, LSP8, LSP5)
  const fetchAssets = useCallback(async () => {
    if (!account?.isConnected) return { lsp12IssuedAssets, lsp5ReceivedAssets };

    const erc725js = new ERC725(
      lsp3ProfileSchema as ERC725JSONSchema[],
      account.address,
      network.provider,
      {
        ipfsGateway: network.ipfsGateway
      }
    );

    try {
      setIsFetchingAssets(true);

      const lsp12IssuedAssetsData = await erc725js.fetchData(
        'LSP12IssuedAssets[]'
      );
      const lsp5ReceivedAssetsData = await erc725js.fetchData(
        'LSP5ReceivedAssets[]'
      );

      // Fetch LSP4 Metadata for a given asset address
      const fetchLSP4Metadata = async (
        assetAddress: string
      ): Promise<AssetMetadata> => {
        try {
          const erc725 = new ERC725(
            lsp4MetadataSchema,
            assetAddress,
            network.provider,
            {
              ipfsGateway: network.ipfsGateway
            }
          );

          const metadata = await erc725.fetchData('LSP4Metadata');
          const symbol = await erc725.fetchData('LSP4TokenSymbol');
          const type = await erc725.fetchData('LSP4TokenType');

          return {
            address: assetAddress,
            name: metadata.value.LSP4Metadata.name,
            symbol: symbol.value,
            image:
              metadata.value.LSP4Metadata.icon[0]?.url.replace(
                'ipfs://',
                network.ipfsGateway
              ) || null,
            type: TOKEN_TYPES[type.value as unknown as number]
          };
        } catch (error) {
          console.error('Error fetching LSP4 metadata:', error);
          return {
            address: assetAddress,
            name: 'Unknown',
            symbol: 'Unknown',
            image: null,
            type: 'LSP7'
          }; // Default fallback
        }
      };

      const lsp12List: AssetMetadata[] = [];
      // Process LSP12 issued assets
      if (Array.isArray(lsp12IssuedAssetsData.value)) {
        for (const asset of lsp12IssuedAssetsData.value) {
          const metadata = await fetchLSP4Metadata(asset);
          lsp12List.push(metadata);
        }
      }

      const lsp5List: AssetMetadata[] = [];
      // Process LSP5 received assets
      if (Array.isArray(lsp5ReceivedAssetsData.value)) {
        for (const asset of lsp5ReceivedAssetsData.value) {
          const metadata = await fetchLSP4Metadata(asset);
          lsp5List.push(metadata);
        }
      }

      setLsp12IssuedAssets(lsp12List);
      setLsp5ReceivedAssets(lsp5List);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setIsFetchingAssets(false);
    }

    return { lsp12IssuedAssets, lsp5ReceivedAssets };
  }, [account, network]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      await fetchAssets();
    };
    fetchData();
  }, [account, network, fetchProfile, fetchAssets]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        lsp12IssuedAssets,
        lsp5ReceivedAssets,
        isFetchingAssets,
        isFetchingProfile,
        fetchProfile,
        fetchAssets
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use profile context
export const useProfile = (): UseProfileResult => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
