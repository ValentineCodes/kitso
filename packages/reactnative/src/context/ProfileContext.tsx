import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import useAccount from '../hooks/scaffold-eth/useAccount';
import useNetwork from '../hooks/scaffold-eth/useNetwork';
import { ethers } from 'ethers';
import LSP7ABI from '../abis/LSP7ABI.json';
import LSP8ABI from '../abis/LSP8ABI.json';

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
  type: 'LSP7' | 'LSP8';
}

interface UseProfileResult {
  profile: Profile | null;
  lsp7Assets: AssetMetadata[];
  lsp8Assets: AssetMetadata[];
  isFetchingAssets: boolean;
  isFetchingProfile: boolean; // Added loading state for profile fetching
  fetchProfile: () => Promise<Profile | null>;
  fetchAssets: () => Promise<{ lsp7Assets: AssetMetadata[]; lsp8Assets: AssetMetadata[] }>; // Fetch function signature
}

// Define props for the ProfileProvider component
interface ProfileProviderProps {
  children: ReactNode; // Type definition for children
}

// Create Profile Context
const ProfileContext = createContext<UseProfileResult | undefined>(undefined);

// Helper to check if the asset is LSP7 or LSP8
const getAssetType = async (assetAddress: string, provider: ethers.providers.Provider) => {
  const contract = new ethers.Contract(assetAddress, LSP7ABI, provider);
  try {
    // Try calling a function specific to LSP7 to check if the contract implements it
    await contract.totalSupply();
    return 'LSP7';
  } catch {
    // If it fails, it's probably LSP8, so try that ABI
    const lsp8Contract = new ethers.Contract(assetAddress, LSP8ABI, provider);
    try {
      await lsp8Contract.tokenId(); // Call a unique LSP8 function
      return 'LSP8';
    } catch {
      return null; // Unknown type or unsupported asset
    }
  }
};

// Profile Provider Component
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const account = useAccount();
  const network = useNetwork();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lsp7Assets, setLSP7Assets] = useState<AssetMetadata[]>([]);
  const [lsp8Assets, setLSP8Assets] = useState<AssetMetadata[]>([]);
  const [isFetchingAssets, setIsFetchingAssets] = useState<boolean>(false); // Track asset fetching status
  const [isFetchingProfile, setIsFetchingProfile] = useState<boolean>(false); // Track profile fetching status

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
      {
        ipfsGateway: network.ipfsGateway,
      },
    );

    try {
      setIsFetchingProfile(true); // Set fetching state to true
      const profileMetaData = await erc725js.fetchData('LSP3Profile');
      if (profileMetaData.value && typeof profileMetaData.value === 'object' && 'LSP3Profile' in profileMetaData.value) {
        const fetchedProfile = profileMetaData.value.LSP3Profile;
        setProfile(fetchedProfile);
        return fetchedProfile;
      }
    } catch (error) {
      console.log('Cannot fetch universal profile data: ', error);
    } finally {
      setIsFetchingProfile(false); // Set fetching state to false after profile is loaded
    }

    return null;
  }, [account, network]);

  // Fetch issued assets after the profile is loaded
  const fetchAssets = useCallback(async () => {
    if (!account?.isConnected) return { lsp7Assets, lsp8Assets }; // Return existing assets if not connected

    const erc725js = new ERC725(
      lsp3ProfileSchema as ERC725JSONSchema[],
      account.address,
      network.provider,
      {
        ipfsGateway: network.ipfsGateway,
      },
    );

    try {
      setIsFetchingAssets(true); // Set fetching state to true
      const lsp12IssuedAssets = await erc725js.fetchData('LSP12IssuedAssets[]');
      const lsp7List: AssetMetadata[] = [];
      const lsp8List: AssetMetadata[] = [];

      if (lsp12IssuedAssets.value && Array.isArray(lsp12IssuedAssets.value)) {
        const assets = lsp12IssuedAssets.value;

        const provider = new ethers.providers.JsonRpcProvider(network.provider);

        for (const asset of assets) {
          const assetType = await getAssetType(asset, provider);
          if (assetType) {
            const contract = new ethers.Contract(asset, assetType === 'LSP7' ? LSP7ABI : LSP8ABI, provider);
            const name = await contract.name();
            const symbol = await contract.symbol();

            const assetMetadata: AssetMetadata = {
              address: asset,
              name,
              symbol,
              type: assetType,
            };

            if (assetType === 'LSP7') {
              lsp7List.push(assetMetadata);
            } else {
              lsp8List.push(assetMetadata);
            }
          }
        }

        setLSP7Assets(lsp7List);
        setLSP8Assets(lsp8List);
      }
    } catch (error) {
      console.log('Cannot fetch issued assets: ', error);
    } finally {
      setIsFetchingAssets(false); // Set fetching state to false after assets are loaded
    }

    return { lsp7Assets, lsp8Assets }; // Return the assets as requested
  }, [account, network]);

  // Fetch profile automatically on mount and trigger fetching assets
  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      await fetchAssets(); // Fetch assets after profile is loaded
    };
    fetchData();
  }, [account, network, fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, lsp7Assets, lsp8Assets, isFetchingAssets, isFetchingProfile, fetchProfile, fetchAssets }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom Hook to use Profile Context
export const useProfile = (): UseProfileResult => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
