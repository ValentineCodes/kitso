import { useModal } from 'react-native-modalfy'
import useNetwork from './useNetwork';
import { useDeployedContractInfo } from './useDeployedContractInfo';
import { useToast } from 'react-native-toast-notifications';
import useTargetNetwork from './useTargetNetwork';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, Wallet, ethers } from "ethers";

import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';

import SInfo from "react-native-sensitive-info"
import useAccount from './useAccount';
import { TransactionReceipt } from 'viem';
import { STORAGE_KEY } from '../../utils/constants';
import { Account } from '../useWallet';

interface UseScaffoldWriteConfig {
    contractName: string
    functionName: string
    args?: any[]
    value?: BigNumber | undefined
    blockConfirmations?: number | undefined
    gasLimit?: BigNumber | undefined
}

interface SendTxConfig {
    args?: any[] | undefined
    value?: BigNumber | undefined
}

/**
 * This returns a function which returns the transaction receipt after contract call
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - arguments for the function
 * @param config.value - value in ETH that will be sent with transaction
 * @param config.blockConfirmations - number of block confirmations to wait for (default: 1)
 * @param config.gasLimit - transaction gas limit
 */

export default function useScaffoldContractWrite({
    contractName, 
    functionName,
    args,
    value,
    blockConfirmations,
    gasLimit
}: UseScaffoldWriteConfig) {
    const writeArgs = args
    const writeValue = value

    const {openModal} = useModal()
    const { data: deployedContractData } = useDeployedContractInfo(contractName)
    const network = useNetwork()
    const account = useAccount()
    const toast = useToast()
    const targetNetwork = useTargetNetwork()
    const connectedAccount = useAccount()

    /**
     * 
     * @param config Optional param settings
     * @param config.args - arguments for the function
     * @param config.value - value in ETH that will be sent with transaction
     * @returns The transaction receipt
     */
    const sendTransaction = async (config: SendTxConfig = {
        args: undefined,
        value: undefined,
    }): Promise<TransactionReceipt> => {
        const {args, value} = config
        const _args = args || writeArgs || []
        const _value = value || writeValue || BigNumber.from(0)
        const _gasLimit = gasLimit || 1000000

        if(!deployedContractData){
            throw new Error("Target Contract is not deployed, did you forget to run `yarn deploy`?")
        }
        if(network.id !== targetNetwork.id) {
            throw new Error("You are on the wrong network")
        }

        return new Promise(async (resolve, reject) => {
            let controllerWallet: Wallet, contract: ethers.Contract;
            
            try {
                const provider = new ethers.providers.JsonRpcProvider(network.provider)
    
                const controller = JSON.parse(await SInfo.getItem("controller", STORAGE_KEY))
    
                controllerWallet = new ethers.Wallet(controller.privateKey).connect(provider)
    
                // @ts-ignore
                contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, controllerWallet)

                openModal("SignTransactionModal", {contract, contractAddress: deployedContractData.address, functionName, args: _args, value: _value, gasLimit: _gasLimit, onConfirm, onReject})
                
            } catch(error) {
                reject(error)
            }

            function onReject(){
                reject("Transaction Rejected!")
            }
    
            async function onConfirm(){
                try {
                    const universalProfile = new ethers.Contract(account.address, UniversalProfileContract.abi, controllerWallet);
                    const keyManager = new ethers.Contract(account.keyManager, KeyManagerContract.abi, controllerWallet);

                    const functionData = contract.interface.encodeFunctionData(functionName, args);

                    const executeData = universalProfile.interface.encodeFunctionData("execute", [
                        0, // Operation type (0 for call)
                        deployedContractData!.address, // Target contract address
                        _value, // Value in LYX (0 for read/write without transferring value)
                        functionData // Encoded function data
                      ]);

                    const tx = await keyManager.functions.execute(executeData, {
                        gasLimit: _gasLimit
                      });
                    const receipt = await tx.wait(blockConfirmations || 1)

                    toast.show("Transaction Successful!", {
                        type: "success"
                    })
                    
                    resolve(receipt)
                } catch(error) {
                    reject(error)
                }
            }
        })
    }

    return {
        write: sendTransaction
    }
}