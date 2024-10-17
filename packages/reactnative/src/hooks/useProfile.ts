import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useAccount from '../hooks/scaffold-eth/useAccount';
import useNetwork from '../hooks/scaffold-eth/useNetwork';

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

interface UseProfileOptions {
  enabled?: boolean;
}

interface UseProfileResult {
  profile: Profile | null;
  issuedAssets: string[];
  fetchProfile: () => Promise<Profile | null>;
}

/**
 * Custom hook to handle profile data fetching and updating.
 *
 * @param {UseProfileOptions} options - Optional settings for the hook.
 * @returns {UseProfileResult} - The profile data, issued assets, and a function to fetch the profile manually.
 */
export function useProfile(
  options: UseProfileOptions = { enabled: true }
): UseProfileResult {
  const { enabled = true } = options;
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
        ipfsGateway: network.ipfsGateway
      }
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

  // Fetch profile automatically if enabled
  useEffect(() => {
    if (enabled) {
      fetchProfile();
    }
  }, [account, network, fetchProfile, enabled]);

  return useMemo(
    () => ({
      profile,
      issuedAssets,
      fetchProfile
    }),
    [profile, issuedAssets, fetchProfile]
  );
}
