import { useModal } from 'react-native-modalfy';
import useNetwork from './useNetwork';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers, Wallet } from 'ethers';
import SInfo from 'react-native-sensitive-info';
import { STORAGE_KEY } from '../../utils/constants';
import useAccount from './useAccount';

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
  const connectedAccount = useAccount();

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
          const provider = new ethers.providers.JsonRpcProvider(
            network.provider
          );

          const controller = JSON.parse(
            await SInfo.getItem('controller', STORAGE_KEY)
          );

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
