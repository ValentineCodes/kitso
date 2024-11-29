import { useSelector } from 'react-redux';

/**
 *
 * @returns Settings
 */
export default function useSettings() {
  // @ts-ignore
  const settings: Profile = useSelector(state => state.settings);
  return settings;
}
