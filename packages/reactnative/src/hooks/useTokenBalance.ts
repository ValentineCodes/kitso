import LSP7 from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import LSP8 from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'; // Adjust the path as necessary
import { useEffect } from 'react';
import useAccount from './scaffold-eth/useAccount';
import useContractRead from './scaffold-eth/useContractRead'; // Import your existing hook

interface UseTokenBalanceOptions {
  tokenAddress: string; // The LSP7 token contract address
  type: 'LSP7' | 'LSP8';
}

export default function useTokenBalance({
  tokenAddress,
  type
}: UseTokenBalanceOptions) {
  const account = useAccount();

  const { data, isLoading, error, refetch } = useContractRead({
    abi: type === 'LSP7' ? LSP7.abi : LSP8.abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account.address],
    enabled: Boolean(tokenAddress && account.address), // Ensure the hook only runs when addresses are provided
    onError: error => {
      console.error('Error fetching LSP7 token balance:', error);
    }
  });

  useEffect(() => {
    // Optionally refetch data when the token address or user address changes
    if (tokenAddress && account.address) {
      refetch();
    }
  }, [tokenAddress, account.address, refetch]);

  return {
    balance: data ? (data as bigint) : null, // Assuming balanceOf returns a tuple [balance]
    isLoading,
    error
  };
}
