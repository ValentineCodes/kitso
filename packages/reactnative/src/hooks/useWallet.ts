import { useEffect, useState } from "react";
import SInfo from "react-native-sensitive-info";
import { useDispatch } from "react-redux";
import { addAccount } from "../store/reducers/Accounts";

export interface Account {
    address: string;
    privateKey: string;
}

const STORAGE_KEY = {
    sharedPreferencesName: "kitso.android.storage",
    keychainService: "kitso.ios.storage",
}

/**
 * @notice hook to read and write mnemonic
 */
export default function useWallet(){
    const [mnemonic, setMnemonic] = useState("");
    const [accounts, setAccounts] = useState<Account[]>([])
    
    const dispatch = useDispatch()

    /**
     * @notice reads mnemonic from secure storage
     * @returns mnemonic string
     */
    async function _getMnemonic(): Promise<string>{
        // read mnemonic from secure storage
        const _mnemonic = await SInfo.getItem("mnemonic", STORAGE_KEY);

        setMnemonic(_mnemonic)

        return _mnemonic
    }

    async function _getAccounts(): Promise<Account[]>{
        // read accounts from secure storage
        const _accounts = await SInfo.getItem("accounts", STORAGE_KEY);
        const accounts = JSON.parse(_accounts!)

        setAccounts(accounts)

        return accounts
    }

    /**
     * @notice encrypts and stores mnemonic in secure storage
     * @param _mnemonic mnemonic string
     */
    async function _setMnemonic(_mnemonic: string){
        setMnemonic(_mnemonic)

        // encrypt and store mnemonic
        await SInfo.setItem("mnemonic", _mnemonic, STORAGE_KEY);
    }

    /**
     * encrypts and stores account data in secure and redux storage
     * @param _account address and private key of account 
     * @param _isImported `true` if account was imported using private key
     */
    async function _setAccount(_account: Account, _isImported: boolean) {
        // read accounts from secure storage
        const _accounts = await SInfo.getItem("accounts", STORAGE_KEY);
        const accounts = JSON.parse(_accounts!)

        const newAccounts = [...JSON.parse(accounts), { privateKey: _account.privateKey, address: _account.address }]

        // encrypt and store accounts 
        await SInfo.setItem("accounts", JSON.stringify(newAccounts), STORAGE_KEY)

        setAccounts(newAccounts)

        dispatch(addAccount({address: _account.address, isImported: _isImported}))
    }

    useEffect(() => {
        _getMnemonic()
        _getAccounts()
    }, [])

    return {
        mnemonic,
        accounts,
        getMnemonic: _getMnemonic,
        getAccounts: _getAccounts,
        setMnemonic: _setMnemonic,
        setAccount: _setAccount
    }
}