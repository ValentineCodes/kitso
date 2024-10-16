import {useEffect} from 'react';
import useNetwork from './scaffold-eth/useNetwork';

/**
 * Options for the useIPFSGateway hook.
 */
interface UseIPFSGatewayOptions {
  /**
   * The URL to be processed if provided.
   */
  url?: string;
}

/**
 * A custom hook that provides a utility to parse IPFS URLs based on the current network's IPFS gateway.
 * It replaces the `ipfs://` protocol with the gateway URL.
 *
 * @param {UseIPFSGatewayOptions} [options={}] - An object that can optionally include a URL to be parsed.
 * @returns {Object} - An object with the `parseIPFSUrl` function, which can be used to transform IPFS URLs.
 */
export function useIPFSGateway({url}: UseIPFSGatewayOptions = {}) {
  const network = useNetwork();

  /**
   * Parses an IPFS URL and replaces the 'ipfs://' protocol with the network's IPFS gateway.
   *
   * @param {string} ipfsUrl - The IPFS URL to be parsed.
   * @returns {string} - The parsed URL with the IPFS gateway.
   */
  function parseIPFSUrl(ipfsUrl: string): string {
    return ipfsUrl.replace('ipfs://', network.ipfsGateway);
  }

  useEffect(() => {
    if (url) {
      parseIPFSUrl(url);
    }
  }, [url]);

  return {parseIPFSUrl};
}
