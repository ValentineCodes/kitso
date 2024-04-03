import React from 'react'
import { useModal } from 'react-native-modalfy'
import useNetwork from './useNetwork'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { Wallet, ethers } from 'ethers'

import SInfo from "react-native-sensitive-info"
import useAccount from './useAccount'

interface SignMessageProps {
    message: any
}

export default function useSignMessage() {
    const {openModal} = useModal()
    const network = useNetwork()
    const connectedAccount = useAccount()

    const signMessage = async ({message}: SignMessageProps): Promise<string> => {
        return new Promise((resolve, reject) => {
            openModal("SignMessageModal", {message, onConfirm})

            async function onConfirm() {
                try {
                    const provider = new ethers.providers.JsonRpcProvider(network.provider)
    
                    const accounts = await SInfo.getItem("accounts", {
                        sharedPreferencesName: "sern.android.storage",
                        keychainService: "sern.ios.storage",
                    })
            
                    const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address.toLowerCase() == connectedAccount.address.toLowerCase())
            
                    const wallet = new ethers.Wallet(activeAccount.privateKey).connect(provider)

                    const signature = await wallet.signMessage(message)

                    resolve(signature)
                } catch(error) {
                    reject(error)
                }
            }
        })
    }

    return {
        signMessage
    }
}