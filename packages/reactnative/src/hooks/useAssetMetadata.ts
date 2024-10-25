import ERC725 from '@erc725/erc725.js';
import lsp4MetadataSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import { useCallback, useEffect, useState } from 'react';
import { TOKEN_TYPES } from '../utils/constants';
import useNetwork from './scaffold-eth/useNetwork';

export type AssetMetadata = {
  address: string;
  name: string;
  symbol: string;
  icon: string | null;
  backgroundImage: string | null;
  type: string;
};

type UseAssetMetadataOptions = {
  assetAddress?: string;
};

const useAssetMetadata = ({ assetAddress }: UseAssetMetadataOptions = {}) => {
  const network = useNetwork();

  const [metadata, setMetadata] = useState<AssetMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getERC725 = (address: string) =>
    new ERC725(lsp4MetadataSchema, address, network.provider, {
      ipfsGateway: network.ipfsGateway
    });

  const fetchMetadata = useCallback(
    async (address: string) => {
      const erc725 = getERC725(address);
      const metadata = await erc725.fetchData('LSP4Metadata');
      return {
        ...metadata.value.LSP4Metadata,
        backgroundImage:
          metadata.value.LSP4Metadata.backgroundImage[0]?.url.replace(
            'ipfs://',
            network.ipfsGateway
          ) || null,
        icon:
          metadata.value.LSP4Metadata.icon[0]?.url.replace(
            'ipfs://',
            network.ipfsGateway
          ) || null,
        images: metadata.value.LSP4Metadata.images.map(
          image => image[0]?.url.replace('ipfs://', network.ipfsGateway) || null
        )
      };
    },
    [network]
  );

  const fetchSymbol = useCallback(
    async (address: string) => {
      const erc725 = getERC725(address);
      const { value } = await erc725.fetchData('LSP4TokenSymbol');
      return value;
    },
    [network]
  );

  const fetchType = useCallback(
    async (address: string) => {
      const erc725 = getERC725(address);
      const { value } = await erc725.fetchData('LSP4TokenType');
      return TOKEN_TYPES[value as unknown as number];
    },
    [network]
  );

  const fetchAssetMetadata = useCallback(
    async (address: string): Promise<AssetMetadata> => {
      try {
        const [metadata, symbol, type] = await Promise.all([
          fetchMetadata(address),
          fetchSymbol(address),
          fetchType(address)
        ]);

        return {
          address,
          name: metadata.name,
          symbol,
          icon: metadata.icon,
          backgroundImage: metadata.backgroundImage,
          type
        };
      } catch (error) {
        console.error('Error fetching asset metadata:', error);
        return {
          address,
          name: 'Unknown',
          symbol: 'Unknown',
          icon: null,
          backgroundImage: null,
          type: 'LSP7'
        };
      }
    },
    [fetchMetadata, fetchSymbol, fetchType]
  );

  useEffect(() => {
    if (!assetAddress) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAssetMetadata(assetAddress);
        setMetadata(result);
      } catch {
        setError('Error fetching metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assetAddress, fetchAssetMetadata]);

  return {
    metadata,
    loading,
    error,
    fetchAssetMetadata,
    fetchMetadata,
    fetchSymbol,
    fetchType
  };
};

export default useAssetMetadata;
