import { Buffer } from 'buffer';
import axios from 'axios';
import { keccak256 } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { ImageType } from '../components/modals/ImageCaptureModal';

const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_API_KEY = '7ddc8c56c25211161baf';
const PINATA_API_SECRET =
  '6fed59a71efcee9b9148ff9c9415faf570093b82e2b42b0b0a2f876587f47796';

interface UseImageUploaderConfig {
  image?: ImageType;
  enabled?: boolean;
  onUpload?: (progress: number) => void;
  onError?: (error: any) => void;
}

interface ImageData {
  ipfsHash: string;
  bufferHash: string;
  size: number;
  timestamp: string;
}

/**
 * @notice uploads image to IPFS via Pinata(https://pinata.cloud)
 * @param config.image - ImageType - name, type, uri
 * @param config.enabled - if true, image is uploaded automatically
 * @param config.onUpload - upload progress handler function
 * @param config.onError - error handler function
 */
export default function useImageUploader({
  image,
  enabled,
  onUpload,
  onError
}: UseImageUploaderConfig) {
  const [data, setData] = useState<ImageData>();
  const [isUploading, setIsUploading] = useState(enabled || false);
  const [progress, setProgress] = useState<number>();
  const [error, setError] = useState<any>();

  // upload image to ipfs via Pinata
  const upload = async (image: ImageType): Promise<ImageData | undefined> => {
    try {
      setIsUploading(true);

      const base64Image = await RNFetchBlob.fs.readFile(image.uri, 'base64');
      const imageBuffer = Buffer.from(base64Image, 'base64');

      const formData = new FormData();
      formData.append('file', image);

      const pinataOptions = JSON.stringify({
        cidVersion: 1
      });

      formData.append('pinataOptions', pinataOptions);

      const { data } = await axios.post(pinataEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET
        },
        onUploadProgress: ({ loaded, total }) => {
          // track upload progress
          const progress = (loaded * 100) / (total || 1);

          setProgress(progress);

          if (onUpload) {
            onUpload(progress);
          }
        }
      });

      if (error) {
        setError(null);
      }

      const result = {
        ipfsHash: data.IpfsHash,
        bufferHash: keccak256(imageBuffer),
        size: data.PinSize,
        timestamp: data.Timestamp
      };
      setData(result);
      return result;
    } catch (error) {
      setError(error);

      if (onError) {
        onError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (enabled !== false && image) {
      upload(image);
    }
  }, [enabled, image]);

  return {
    data,
    isUploading,
    progress,
    error,
    upload
  };
}
