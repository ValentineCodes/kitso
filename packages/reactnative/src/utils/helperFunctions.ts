import { utils } from 'ethers';

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

/**
 * Truncates string (in the middle) via given lenght value
 */
export function truncate(value: string, length: number) {
  if (value?.length <= length) {
    return value;
  }

  const separator = '...';
  const stringLength = length - separator.length;
  const frontLength = Math.ceil(stringLength / 2);
  const backLength = Math.floor(stringLength / 2);

  return (
    value.substring(0, frontLength) +
    separator +
    value.substring(value.length - backLength)
  );
}

/**
 * Converts hex to utf8 string if it is valid bytes
 */
export function convertHexToUtf8(value: string) {
  if (utils.isHexString(value)) {
    return utils.toUtf8String(value);
  }

  return value;
}

/**
 * Gets message from various signing request methods by filtering out
 * a value that is not an address (thus is a message).
 * If it is a hex string, it gets converted to utf8 string
 */
export function getSignParamsMessage(params: string[]) {
  const message = params.filter(p => !utils.isAddress(p))[0];

  return convertHexToUtf8(message);
}

/**
 * Gets data from various signTypedData request methods by filtering out
 * a value that is not an address (thus is data).
 * If data is a string convert it to object
 */
export function getSignTypedDataParamsData(params: string[]) {
  const data = params.filter(p => !utils.isAddress(p))[0];

  if (typeof data === 'string') {
    return JSON.parse(data);
  }

  return data;
}

/**
 * Get our address from params checking if params string contains one
 * of our wallet addresses
 */
export function getWalletAddressFromParams(addresses: string[], params: any) {
  const paramsString = JSON.stringify(params);
  let address = '';

  addresses.forEach(addr => {
    if (paramsString.includes(addr)) {
      address = addr;
    }
  });

  return address;
}

/**
 * Check if chain is part of EIP155 standard
 */
export function isEIP155Chain(chain: string) {
  return chain.includes('eip155');
}

/**
 * Check if chain is part of COSMOS standard
 */
export function isCosmosChain(chain: string) {
  return chain.includes('cosmos');
}

/**
 * Check if chain is part of SOLANA standard
 */
export function isSolanaChain(chain: string) {
  return chain.includes('solana');
}

export function parseFloat(str: string, val: number) {
  str = str.toString();
  str = str.slice(0, str.indexOf('.') + val + 1);
  return Number(str);
}

export const isENS = (name = '') =>
  name.endsWith('.eth') || name.endsWith('.xyz');

export function isValidImage(type: string): boolean {
  return type === 'image/jpeg' || type === 'image/png' || type === 'image/gif';
}

/**
 * Helper function to get the first 4 hex characters of an Ethereum wallet address,
 * excluding the '0x' prefix.
 *
 * @param {string} address - The Ethereum wallet address.
 * @returns {string} - The first 4 hex characters of the wallet address (without '0x').
 * @throws Will throw an error if the address is invalid or too short.
 */
export function getFirst4Hex(address: string): string {
  // Ensure the address is valid and has the expected length
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid Ethereum address');
  }

  // Remove '0x' prefix and return the first 4 characters
  return address.slice(2, 6);
}

/**
 * Trims an Ethereum address to the first 6 hexadecimal characters (excluding "0x").
 * @param {string} address - The Ethereum address to be trimmed.
 * @returns {string} - The first 6 hexadecimal characters of the address.
 */
export const getFirstSixHex = (address: string): string => {
  // Ensure the address is valid and has the expected length
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid Ethereum address');
  }

  // Return the first 6 hex characters (excluding "0x")
  return address.slice(2, 8); // Skip the "0x" and take the next 6 characters
};
