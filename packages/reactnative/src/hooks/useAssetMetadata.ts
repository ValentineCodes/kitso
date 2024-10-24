import ERC725 from '@erc725/erc725.js'; // Import ERC725.js
import lsp4MetadataSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import { useCallback, useEffect, useState } from 'react';
import { TOKEN_TYPES } from '../utils/constants';
import useNetwork from './scaffold-eth/useNetwork';

export type AssetMetadata = {
  address: string;
  name: string;
  symbol: string;
  image: string | null;
  type: string;
};

type UseAssetMetadataOptions = {
  assetAddress?: string; // Optional assetAddress
};

const useAssetMetadata = ({ assetAddress }: UseAssetMetadataOptions = {}) => {
  const network = useNetwork();

  const [metadata, setMetadata] = useState<AssetMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Initially not loading
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the asset metadata (renamed from fetchLSP4Metadata)
  const fetchAssetMetadata = useCallback(
    async (assetAddress: string): Promise<AssetMetadata> => {
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
        console.error('Error fetching asset metadata:', error);
        return {
          address: assetAddress,
          name: 'Unknown',
          symbol: 'Unknown',
          image: null,
          type: 'LSP7' // Default fallback
        };
      }
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!assetAddress) return; // Exit if no assetAddress is provided

      setLoading(true);
      setError(null);
      try {
        const result = await fetchAssetMetadata(assetAddress);
        setMetadata(result);
      } catch (err) {
        setError('Error fetching metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Trigger fetch only if assetAddress is provided
  }, [assetAddress, fetchAssetMetadata]);

  return { metadata, loading, error, fetchAssetMetadata };
};

export default useAssetMetadata;
