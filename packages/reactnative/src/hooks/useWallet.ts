import { useEffect, useState } from "react";
import SInfo from "react-native-sensitive-info";
import { useDispatch } from "react-redux";
import { addAccount } from "../store/reducers/Accounts";
import { STORAGE_KEY } from "../utils/constants";

export interface Account {
    address: string;
    privateKey: string;
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
        const accounts = JSON.parse(_accounts!) || []

        setAccounts(accounts)

        return accounts
    }

    /**
     * @notice encrypts and stores mnemonic in secure storage
     * @param _mnemonic mnemonic string
     */
    async function _storeMnemonic(_mnemonic: string){
        setMnemonic(_mnemonic)

        // encrypt and store mnemonic
        await SInfo.setItem("mnemonic", _mnemonic, STORAGE_KEY);
    }

    /**
     * encrypts and stores account data in secure and redux storage
     * @param _account address and private key of account 
     * @param _isImported `true` if account was imported using private key
     */
    async function _storeAccount(_account: Account, _isImported: boolean) {
        // read accounts from secure storage
        const _accounts = await SInfo.getItem("accounts", STORAGE_KEY);
        const accounts = JSON.parse(_accounts!) || []

        const newAccounts = [...JSON.parse(accounts), _account]

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
        storeMnemonic: _storeMnemonic,
        storeAccount: _storeAccount
    }
}