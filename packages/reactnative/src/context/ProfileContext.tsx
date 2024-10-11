import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
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

interface UseProfileResult {
  profile: Profile | null;
  issuedAssets: string[];
  fetchProfile: () => Promise<Profile | null>;
}

// Define props for the ProfileProvider component
interface ProfileProviderProps {
  children: ReactNode;  // Type definition for children
}

// Create Profile Context
const ProfileContext = createContext<UseProfileResult | undefined>(undefined);

// Profile Provider Component
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const account = useAccount();
  const network = useNetwork();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [issuedAssets, setIssuedAssets] = useState<string[]>([]);

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
      const profileMetaData = await erc725js.fetchData('LSP3Profile');
      const lsp12IssuedAssets = await erc725js.fetchData('LSP12IssuedAssets[]');

      if (
        profileMetaData.value &&
        typeof profileMetaData.value === 'object' &&
        'LSP3Profile' in profileMetaData.value
      ) {
        const fetchedProfile = profileMetaData.value.LSP3Profile;
        setProfile(fetchedProfile);

        if (lsp12IssuedAssets.value && Array.isArray(lsp12IssuedAssets.value)) {
          setIssuedAssets(lsp12IssuedAssets.value);
        }

        return fetchedProfile;
      }
    } catch (error) {
      console.log('Cannot fetch universal profile data: ', error);
    }

    return null;
  }, [account, network]);

  // Fetch profile automatically on mount
  useEffect(() => {
    fetchProfile();
  }, [account, network, fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, issuedAssets, fetchProfile }}>
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
