import { useModal } from 'react-native-modalfy';
import useNetwork from './useNetwork';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import { useSecureStorage } from '../useSecureStorage';
import { Controller } from '../useWallet';

interface UseSignMessageConfig {
  message?: string;
}

/**
 *
 * @param config - The config settings
 * @param config.message - The message to sign
 */
export default function useSignMessage({ message }: UseSignMessageConfig) {
  const messageToSign = message;

  const { openModal } = useModal();
  const network = useNetwork();

  const { getItem } = useSecureStorage();

  const signMessage = async (
    config: UseSignMessageConfig = {
      message: undefined
    }
  ): Promise<string> => {
    const { message } = config;
    const _message = message || messageToSign;

    return new Promise((resolve, reject) => {
      openModal('SignMessageModal', { message: _message, onReject, onConfirm });

      function onReject() {
        reject('Signing Rejected!');
      }

      async function onConfirm() {
        try {
          const provider = new ethers.JsonRpcProvider(network.provider);

          const controller = (await getItem('controller')) as Controller;

          const wallet = new ethers.Wallet(controller.privateKey).connect(
            provider
          );

          // @ts-ignore
          const signature = await wallet.signMessage(_message);

          resolve(signature);
        } catch (error) {
          reject(error);
        }
      }
    });
  };

  return {
    signMessage
  };
}
