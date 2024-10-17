import { useEffect, useState } from 'react';
import SInfo from 'react-native-sensitive-info';
import { STORAGE_KEY } from '../utils/constants';

export interface Security {
  password: string;
  isBiometricsEnabled: boolean;
}

/**
 * @notice hook to read and write security data
 */
export default function useSecurity() {
  const [security, setSecurity] = useState<Security>();

  /**
   * @notice reads security data from secure storage
   * @returns security data - `Security` interface
   */
  async function _getSecurity(): Promise<Security> {
    // read security data from secure storage
    const _security = await SInfo.getItem('security', STORAGE_KEY);
    const security = JSON.parse(_security!);

    setSecurity(security);

    return security;
  }

  /**
   * @notice encrypts and stores security data
   * @param security security data - `Security` interface
   */
  async function _setSecurity(security: Security) {
    setSecurity(security);

    // encrypt and store security data
    await SInfo.setItem('security', JSON.stringify(security), STORAGE_KEY);
  }

  useEffect(() => {
    _getSecurity();
  }, []);

  return {
    security,
    getSecurity: _getSecurity,
    setSecurity: _setSecurity
  };
}
