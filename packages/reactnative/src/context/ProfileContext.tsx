import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import lsp4MetadataSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import useAccount from '../hooks/scaffold-eth/useAccount';
import useNetwork from '../hooks/scaffold-eth/useNetwork';

// Profile Types
interface Profile {
  name: string;
  description: string;
  tags: string[];
  links: Link[];
  profileImage: Image[];
  backgroundImage: Image[];
}

interface Link {
  title: string;
  url: string;
}

interface Image {
  width: number;
  height: number;
  hashFunction: string;
  hash: string;
  url: string;
}

interface AssetMetadata {
  address: string;
  name: string;
  symbol: string;
  icon?: string | null;
  type: 'LSP7' | 'LSP8' | 'LSP8 COLLECTION';
}

interface UseProfileResult {
  profile: Profile | null;
  lsp12IssuedAssets: AssetMetadata[];  // Combined storage for LSP7 and LSP8 assets
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
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const account = useAccount();
  const network = useNetwork();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lsp12IssuedAssets, setLsp12IssuedAssets] = useState<AssetMetadata[]>([]); // Combined assets
  const [lsp5ReceivedAssets, setLsp5ReceivedAssets] = useState<AssetMetadata[]>([]);
  const [isFetchingAssets, setIsFetchingAssets] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

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
      if (profileMetaData.value && typeof profileMetaData.value === 'object' && 'LSP3Profile' in profileMetaData.value) {
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

    const erc725js = new ERC725(lsp3ProfileSchema as ERC725JSONSchema[], account.address, network.provider, {
      ipfsGateway: network.ipfsGateway,
    });

    try {
      setIsFetchingAssets(true);

      const lsp12IssuedAssetsData = await erc725js.fetchData('LSP12IssuedAssets[]');
      const lsp5ReceivedAssetsData = await erc725js.fetchData('LSP5ReceivedAssets[]');

      const fetchLSP4Metadata = async (assetAddress: string) => {
        try {
          const erc725 = new ERC725(lsp4MetadataSchema, assetAddress, network.provider, {
            ipfsGateway: network.ipfsGateway,
          });

          const metadata = await erc725.fetchData('LSP4Metadata');
          console.log("metadata: ", metadata)
          const name = await erc725.fetchData('LSP4TokenName');
          const symbol = await erc725.fetchData('LSP4TokenSymbol');
          const type = await erc725.fetchData('LSP4TokenType');

          return { name: name.value, symbol: symbol.value, type: TOKEN_TYPES[type.value as unknown as number] };
        } catch (error) {
          console.error('Error fetching LSP4 metadata:', error);
          return { name: 'Unknown', symbol: 'Unknown', icon: null };
        }
      };

      const lsp12List: AssetMetadata[] = []; // Unified storage for LSP7 and LSP8

      // Process LSP12 issued assets
      if (Array.isArray(lsp12IssuedAssetsData.value)) {
        for (const asset of lsp12IssuedAssetsData.value) {
          const metadata = await fetchLSP4Metadata(asset);
          const assetMetadata: AssetMetadata = {
            address: asset,
            name: metadata.name as string,
            symbol: metadata.symbol as string,
            icon: 'metadata.icon',
            type: metadata.type as any,
          };
          lsp12List.push(assetMetadata);
        }
      }

      // Process LSP5 received assets
      const lsp5List: AssetMetadata[] = [];
      if (Array.isArray(lsp5ReceivedAssetsData.value)) {
        for (const asset of lsp5ReceivedAssetsData.value) {
          const metadata = await fetchLSP4Metadata(asset);
          const assetMetadata: AssetMetadata = {
            address: asset,
            name: metadata.name as string,
            symbol: metadata.symbol as string,
            icon: metadata.icon,
            type: metadata.type as any,
          };
          lsp5List.push(assetMetadata);
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
  }, [account, network, fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        lsp12IssuedAssets, // Unified assets
        lsp5ReceivedAssets,
        isFetchingAssets,
        isFetchingProfile,
        fetchProfile,
        fetchAssets,
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
