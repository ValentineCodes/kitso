import {useEffect} from 'react';
import useContractRead from './scaffold-eth/useContractRead'; // Import your existing hook
import useAccount from './scaffold-eth/useAccount';
import LSP7 from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';

interface UseLsp7TokenBalanceOptions {
  tokenAddress: string; // The LSP7 token contract address
}

export default function useLsp7TokenBalance({
  tokenAddress,
}: UseLsp7TokenBalanceOptions) {
  const account = useAccount();

  const {data, isLoading, error, refetch} = useContractRead({
    abi: LSP7.abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account.address],
    enabled: Boolean(tokenAddress && account.address), // Ensure the hook only runs when addresses are provided
    onError: error => {
      console.error('Error fetching LSP7 token balance:', error);
    },
  });

  useEffect(() => {
    // Optionally refetch data when the token address or user address changes
    if (tokenAddress && account.address) {
      refetch();
    }
  }, [tokenAddress, account.address, refetch]);

  return {
    balance: data ? data[0] : null, // Assuming balanceOf returns a tuple [balance]
    isLoading,
    error,
  };
}
