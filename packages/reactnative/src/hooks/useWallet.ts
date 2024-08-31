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
    const [controller, setAccounts] = useState<Account[]>([])
    
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
        // read controller from secure storage
        const _controller = await SInfo.getItem("controller", STORAGE_KEY);
        const controller = JSON.parse(_controller!) || []

        setAccounts(controller)

        return controller
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
     * @param _controller address and private key of account 
     * @param _isImported `true` if account was imported using private key
     */
    async function _storeAccount(_controller: Account, _isImported: boolean) {
        // read controller from secure storage
        const controller = JSON.parse(await SInfo.getItem("controller", STORAGE_KEY))

        const newAccounts = [JSON.parse(controller), _controller]

        // encrypt and store controller 
        await SInfo.setItem("controller", JSON.stringify(newAccounts), STORAGE_KEY)

        setAccounts(newAccounts)

        dispatch(addAccount({address: _controller.address, isImported: _isImported}))
    }

    useEffect(() => {
        _getMnemonic()
        _getAccounts()
    }, [])

    return {
        mnemonic,
        controller,
        getMnemonic: _getMnemonic,
        getAccounts: _getAccounts,
        storeMnemonic: _storeMnemonic,
        storeAccount: _storeAccount
    }
}