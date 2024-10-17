import { useSelector } from 'react-redux';
import { Profile } from '../../store/reducers/Profiles';

/**
 *
 * @returns The connected account
 */
export default function useAccount() {
  // @ts-ignore
  const connectedAccount: Profile = useSelector(state =>
    state.profiles.find((profile: Profile) => profile.isConnected)
  );
  return connectedAccount;
}
