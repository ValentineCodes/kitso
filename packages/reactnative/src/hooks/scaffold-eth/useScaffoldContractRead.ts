import React, { useEffect, useState } from 'react';
import { useDeployedContractInfo } from './useDeployedContractInfo';
import useNetwork from './useNetwork';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import useAccount from './useAccount';

type Props = {
  contractName: string;
  functionName: string;
  args?: any[];
};

/**
 * This automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - args to be passed to the function call (Optional)
 */

export default function useScaffoldContractRead({
  contractName,
  functionName,
  args: _args
}: Props) {
  const args = _args || [];

  const {
    data: deployedContractData,
    isLoading: isLoadingDeployedContractData
  } = useDeployedContractInfo(contractName);
  const network = useNetwork();
  const account = useAccount();

  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  async function fetchData() {
    if (!deployedContractData) return;

    try {
      setIsLoading(true);
      const provider = new ethers.JsonRpcProvider(network.provider);

      // @ts-ignore
      const contract = new ethers.Contract(
        deployedContractData.address,
        deployedContractData.abi,
        provider
      );

      const result = await contract[functionName](...args, {
        from: account.address
      });

      if (error) {
        setError(null);
      }
      setData(result);

      return result;
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [isLoadingDeployedContractData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}
