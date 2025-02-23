import { useModal } from 'react-native-modalfy';
import { useToast } from 'react-native-toast-notifications';
import useNetwork from './useNetwork';
import useTargetNetwork from './useTargetNetwork';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { Abi } from 'abitype';
import { ContractInterface, ethers, toBigInt } from 'ethers';
import { useState } from 'react';
import { TransactionReceipt } from 'viem';
import { STORAGE_KEY } from '../../utils/constants';
import { useSecureStorage } from '../useSecureStorage';
import useSettings from '../useSettings';
import { Controller } from '../useWallet';
import useAccount from './useAccount';

interface UseWriteConfig {
  abi: ContractInterface | Abi;
  address: string;
  functionName: string;
  args?: any[];
  value?: bigint | undefined;
  blockConfirmations?: number;
  gasLimit?: bigint | undefined;
}

interface SendTxConfig {
  args?: any[];
  value?: bigint | undefined;
}

/**
 * This sends a transaction to the contract and returns the transaction receipt
 * @param config - The config settings
 * @param config.abi - contract abi
 * @param config.address - contract address
 * @param config.functionName - name of the function to be called
 * @param config.args - arguments for the function
 * @param config.value - value in ETH that will be sent with transaction
 * @param config.blockConfirmations - number of block confirmations to wait for (default: 1)
 * @param config.gasLimit - transaction gas limit
 */
export default function useContractWrite({
  abi,
  address,
  functionName,
  args,
  value,
  blockConfirmations,
  gasLimit
}: UseWriteConfig) {
  const writeArgs = args;
  const writeValue = value;
  const _gasLimit = gasLimit || 1000000;

  const settings = useSettings();
  const { openModal } = useModal();
  const network = useNetwork();
  const toast = useToast();
  const targetNetwork = useTargetNetwork();
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const { getItem } = useSecureStorage();

  /**
   *
   * @param config Optional param settings
   * @param config.args - arguments for the function
   * @param config.value - value in ETH that will be sent with transaction
   * @returns The transacction receipt
   */

  const sendTransaction = async (
    config: SendTxConfig = {
      args: undefined,
      value: undefined
    }
  ): Promise<TransactionReceipt> => {
    const { args, value } = config;
    const _args = args || writeArgs || [];
    const _value = value || writeValue || toBigInt(0);

    if (network.id !== targetNetwork.id) {
      throw new Error('You are on the wrong network');
    }

    return new Promise(async (resolve, reject) => {
      let keyManager: ethers.Contract, executeData: string;
      try {
        const provider = new ethers.JsonRpcProvider(network.provider);

        const controller: Controller = (await getItem(
          'controller'
        )) as Controller;

        const controllerWallet = new ethers.Wallet(
          controller.privateKey
        ).connect(provider);

        // @ts-ignore
        const contract = new ethers.Contract(address, abi, controllerWallet);

        const universalProfile = new ethers.Contract(
          account.address,
          UniversalProfileContract.abi,
          controllerWallet
        );
        keyManager = new ethers.Contract(
          account.keyManager,
          KeyManagerContract.abi,
          controllerWallet
        );

        const functionData = contract.interface.encodeFunctionData(
          functionName,
          _args
        );

        executeData = universalProfile.interface.encodeFunctionData('execute', [
          0, // Operation type (0 for call)
          address, // Target contract address
          _value, // Value in LYX (0 for read/write without transferring value)
          functionData // Encoded function data
        ]);

        if (settings.autoSign) {
          onConfirm();
          return;
        }

        openModal('SignTransactionModal', {
          contract: keyManager,
          contractAddress: address,
          functionName,
          calldata: executeData,
          value: _value,
          gasLimit: _gasLimit,
          onConfirm,
          onReject
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }

      async function onConfirm() {
        setIsLoading(true);
        try {
          const tx = await keyManager.execute(executeData, {
            gasLimit: _gasLimit
          });
          const receipt = await tx.wait(blockConfirmations || 1);

          toast.show('Transaction Successful!', {
            type: 'success'
          });

          resolve(receipt);
        } catch (error) {
          console.error(error);
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }

      function onReject() {
        reject('Transaction Rejected!');
      }
    });
  };

  return {
    isLoading,
    write: sendTransaction
  };
}
