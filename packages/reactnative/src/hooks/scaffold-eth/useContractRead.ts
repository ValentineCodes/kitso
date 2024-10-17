import { useEffect, useState } from 'react';
import useNetwork from './useNetwork';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { Abi } from 'abitype';
import { ContractInterface, ethers } from 'ethers';
import useAccount from './useAccount';

interface UseContractReadConfig {
  abi: Abi | ContractInterface;
  address: string;
  functionName: string;
  args?: any[];
  enabled?: boolean;
  onError?: (error: any) => void;
}

/**
 * This makes a call to the contract and returns the data
 * @param config - The config settings
 * @param config.abi - contract abi
 * @param config.address - contract address
 * @param config.functionName - name of the function to be called
 * @param config.args - args to be passed to the function call (Optional)
 * @param config.enabled - if true, data is fetched automatically
 * @param config.onError - error handler function
 */

export default function useContractRead({
  abi,
  address,
  functionName,
  args,
  enabled,
  onError
}: UseContractReadConfig) {
  const network = useNetwork();
  const account = useAccount();

  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(enabled || false);
  const [error, setError] = useState<any>(null);

  async function fetchData() {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.JsonRpcProvider(network.provider);

      // @ts-ignore
      const contract = new ethers.Contract(address, abi, provider);

      const result = await contract.functions[functionName](...(args || []), {
        from: account.address
      });

      if (error) {
        setError(null);
      }
      setData(result);

      return result;
    } catch (error) {
      setError(error);

      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (enabled !== false) {
      fetchData();
    }
  }, [enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}
