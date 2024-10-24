import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

type UseURLOptions = {
  url?: string;
};

type UseURLReturn = {
  openURL: (url?: string) => Promise<void>;
};

/**
 * useURL Hook
 *
 * A custom hook that provides the functionality to open a URL using the system's default browser.
 * It accepts an optional `options` object that can contain a `url` parameter.
 *
 * If no `url` is provided either in the options or when calling `openURL`, the function does nothing.
 *
 * @param {UseURLOptions} options - An optional object containing:
 *   - url: The URL string to be opened. Can also be provided when calling `openURL`.
 *
 * @returns {UseURLReturn} - Returns an object containing:
 *   - openURL: A function that accepts an optional URL string and attempts to open it using the device's browser.
 *     If an error occurs, it shows a toast message.
 *
 * @example
 * const { openURL } = useURL({ url: 'https://example.com' });
 *
 * // Call openURL directly with a URL:
 * openURL();
 *
 * // Alternatively, pass a different URL when calling openURL:
 * openURL('https://another-example.com');
 */
const useURL = (options: UseURLOptions = {}): UseURLReturn => {
  const toast = useToast(); // Assuming you have a toast library

  /**
   * openURL Function
   *
   * This function attempts to open the provided URL using the system's default browser.
   * If the URL is invalid or the operation fails, it logs the error and shows a toast message.
   *
   * @param {string} [url] - The URL string to be opened. If not provided, it falls back to the URL passed in options.
   */
  const openURL = useCallback(
    async (url?: string) => {
      const finalURL = url || options.url;

      if (!finalURL) {
        console.warn('No URL provided.');
        return;
      }

      try {
        await Linking.openURL(finalURL);
      } catch (error) {
        console.error('Error opening URL:', error);
        toast.show('Failed to open URL', { type: 'danger' });
      }
    },
    [options.url, toast]
  );

  return { openURL };
};

export default useURL;
