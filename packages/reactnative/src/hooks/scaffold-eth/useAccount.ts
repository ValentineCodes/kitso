import { useSelector } from 'react-redux'
import { Account } from '../../store/reducers/Accounts'

/**
 * 
 * @returns The connected account
 */
export default function useAccount() {
    // @ts-ignore
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
    return connectedAccount
}