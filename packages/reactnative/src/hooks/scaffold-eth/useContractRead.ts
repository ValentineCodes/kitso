import { useEffect, useState } from 'react'
import useNetwork from './useNetwork'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ContractInterface, ethers } from "ethers";
import SInfo from "react-native-sensitive-info"
import { Abi } from 'abitype'
import { STORAGE_KEY } from '../../utils/constants';

interface UseContractReadConfig {
    abi: Abi | ContractInterface
    address: string
    functionName: string
    args?: any[]
    enabled?: boolean
    onError?: (error: any) => void
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
    const network = useNetwork()

    const [data, setData] = useState<any[] | null>(null)
    const [isLoading, setIsLoading] = useState(enabled || false)
    const [error, setError] = useState<any>(null)

    async function fetchData(){
        try {
            setIsLoading(true)
            const provider = new ethers.providers.JsonRpcProvider(network.provider)

            const controller = JSON.parse(await SInfo.getItem("controller", STORAGE_KEY))
    
            const wallet = new ethers.Wallet(controller.privateKey).connect(provider)

            // @ts-ignore
            const contract = new ethers.Contract(address, abi, wallet)


            const result = await contract.functions[functionName](...(args || []))
            
            if(error) {
                setError(null)
            }
            setData(result)

            return result
        } catch(error) {
            setError(error)
            
            if(onError) {
                onError(error)
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(enabled !== false) {
            fetchData()
        }
    }, [enabled])
    

    return {
        data,
        isLoading,
        error,
        refetch: fetchData
    }
}