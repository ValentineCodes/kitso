import { ethers, network } from 'hardhat';
import * as dotenv from 'dotenv';
import { ERC725 } from '@erc725/erc725.js';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { EncodeDataInput } from '@erc725/erc725.js/build/main/src/types/decodeData';

dotenv.config();

interface CustomNetworkConfig {
  url?: string;
}

const PINATA_API_KEY = '7ddc8c56c25211161baf';
const PINATA_API_SECRET =
  '6fed59a71efcee9b9148ff9c9415faf570093b82e2b42b0b0a2f876587f47796';

// Function to upload an image to Pinata and return IPFS hash and buffer hash
async function uploadToPinata(
  imagePath: string
): Promise<{ ipfsHash: string; bufferHash: string } | null> {
  try {
    const formData = new FormData();
    const imageBuffer = fs.readFileSync(imagePath);
    const imageStream = fs.createReadStream(imagePath);

    formData.append('file', imageStream);
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    const { data } = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET
        }
      }
    );

    console.log('Image successfully uploaded to IPFS:', data.IpfsHash);

    const bufferHash = ethers.keccak256(imageBuffer);

    return { ipfsHash: data.IpfsHash, bufferHash };
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    return null;
  }
}

// Function to upload JSON to Pinata and return IPFS hash
async function uploadJSONToPinata(jsonData: any): Promise<string | null> {
  try {
    const body = {
      pinataOptions: {
        cidVersion: 1
      },
      pinataContent: jsonData
    };

    const { data } = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET
        }
      }
    );

    console.log('JSON successfully uploaded to IPFS:', data.IpfsHash);
    return data.IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    return null;
  }
}

// Main function to attach asset metadata
export async function attachAssetMetadata(
  assetAddress: string,
  imagePath: string
) {
  const [signer] = await ethers.getSigners();
  console.log('Updating metadata with signer:', signer.address);

  console.log('Attaching metadata to ', assetAddress);
  const token = await ethers.getContractAt('MockLSP8', assetAddress);

  const { url: networkUrl } = network.config as CustomNetworkConfig;
  if (!networkUrl) {
    throw new Error('Network URL is not defined in the Hardhat configuration.');
  }

  const erc725 = new ERC725(LSP4DigitalAssetSchema, assetAddress, networkUrl);

  // Upload image to Pinata
  const uploadResult = await uploadToPinata(imagePath);
  if (!uploadResult) {
    throw new Error('Failed to upload image to Pinata.');
  }

  const { ipfsHash, bufferHash } = uploadResult;

  // Construct the new metadata with the uploaded image
  const metadataJSON = {
    LSP4Metadata: {
      name: 'ANIME',
      description: 'Introducing $anime',
      links: [
        { title: 'X', url: 'https://twitter.com/chillwhales' },
        { title: 'Common Ground', url: 'https://app.cg/c/bZe26yK9Uh/' },
        { title: 'Chillwhales', url: 'https://chillwhales.com/' }
      ],
      icon: [
        {
          width: 1614,
          height: 1614,
          url: `ipfs://${ipfsHash}`,
          verification: {
            method: 'keccak256(bytes)',
            data: bufferHash
          }
        }
      ],
      images: [
        [
          {
            width: 480,
            height: 480,
            url: `ipfs://${ipfsHash}`,
            verification: {
              method: 'keccak256(bytes)',
              data: bufferHash
            }
          }
        ]
      ],
      backgroundImage: [
        {
          width: 1200,
          height: 400,
          url: `ipfs://${ipfsHash}`,
          verification: {
            method: 'keccak256(bytes)',
            data: bufferHash
          }
        }
      ],
      assets: []
    }
  };

  const metadataHash = await uploadJSONToPinata(metadataJSON);

  if (!metadataHash) {
    throw new Error('Failed to upload metadata to Pinata.');
  }

  const newMetadata: EncodeDataInput[] = [
    {
      keyName: 'LSP4Metadata',
      value: {
        json: metadataJSON,
        url: `ipfs://${metadataHash}`
      }
    }
  ];

  const encodedMetadata = erc725.encodeData(newMetadata);

  // Update metadata on the blockchain
  const tx = await token.setDataBatch(
    encodedMetadata.keys,
    encodedMetadata.values
  );
  const receipt = await tx.wait();

  console.log('Metadata updated successfully✅');
}

// Replace with the correct asset address and image path
const assetAddress = '0x7693d152c741aAAfeCea293901F3431f3314E185'; // Your asset address
const imagePath = path.join(__dirname, '../assets/images/token.jpeg'); // Update with your image file path

attachAssetMetadata(assetAddress, imagePath)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error updating metadata:', error);
    process.exit(1);
  });
