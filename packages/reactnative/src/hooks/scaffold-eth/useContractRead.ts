import React, { useEffect, useState } from 'react'
import { useDeployedContractInfo } from './useDeployedContractInfo'
import useNetwork from './useNetwork'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ContractInterface, Wallet, ethers } from "ethers";
import useAccount from './useAccount'
import SInfo from "react-native-sensitive-info"
import { Abi } from 'abitype'

interface Props {
    abi: Abi | ContractInterface
    address: string
    functionName: string
    args?: any[]
    enabled?: boolean
    onError?: (error: any) => void
}

export default function useContractRead({abi, address, functionName, args, enabled, onError}: Props) {
    const network = useNetwork()
    const connectedAccount = useAccount()

    const [data, setData] = useState<any[] | null>(null)
    const [isLoading, setIsLoading] = useState(enabled || false)
    const [error, setError] = useState<any>(null)

    async function fetchData(){
        try {
            setIsLoading(true)
            const provider = new ethers.providers.JsonRpcProvider(network.provider)

            const accounts = await SInfo.getItem("accounts", {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            })
    
            const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address.toLowerCase() == connectedAccount.address.toLowerCase())
    
            const wallet = new ethers.Wallet(activeAccount.privateKey).connect(provider)

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