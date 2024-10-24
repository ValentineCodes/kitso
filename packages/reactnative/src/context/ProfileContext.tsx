import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
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
import useAssetMetadata from '../hooks/useAssetMetadata';

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

// Profile Provider Component
export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children
}) => {
  const account = useAccount();
  const network = useNetwork();

  const {fetchAssetMetadata} = useAssetMetadata()

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

      const lsp12List: AssetMetadata[] = [];
      // Process LSP12 issued assets
      if (Array.isArray(lsp12IssuedAssetsData.value)) {
        for (const asset of lsp12IssuedAssetsData.value) {
          const metadata = await fetchAssetMetadata(asset);
          lsp12List.push(metadata);
        }
      }

      const lsp5List: AssetMetadata[] = [];
      // Process LSP5 received assets
      if (Array.isArray(lsp5ReceivedAssetsData.value)) {
        for (const asset of lsp5ReceivedAssetsData.value) {
          const metadata = await fetchAssetMetadata(asset);
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
