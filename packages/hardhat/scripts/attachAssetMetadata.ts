import { ethers, network } from "hardhat";
import * as dotenv from "dotenv";
import { ERC725YDataKeys } from "@lukso/lsp-smart-contracts";
import { ERC725 } from "@erc725/erc725.js";
import LSP4DigitalAssetSchema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";

import { lsp4SampleMetadata } from "../consts/LSP4SampleMetadata";

dotenv.config();

interface CustomNetworkConfig {
  url?: string;
}

export async function attachAssetMetadata(assetAddress: string) {
  const [signer] = await ethers.getSigners();
  console.log("Updating metadata with signer: ", signer.address);

  const token = await ethers.getContractAt("MockLSP8", assetAddress);
  const metadataKey = ERC725YDataKeys.LSP4["LSP4Metadata"];

  const { url: networkUrl } = network.config as CustomNetworkConfig;
  if (!networkUrl) {
    throw new Error("Network URL is not defined in the Hardhat configuration.");
  }

  const erc725 = new ERC725(LSP4DigitalAssetSchema, assetAddress, networkUrl);

  // Read current metadata
  const currentMetadata = await erc725.getData(metadataKey);
  console.log("Current token metadata:", currentMetadata);

  const encodedMetadata = erc725.encodeData(lsp4SampleMetadata);

  // Update metadata
  const tx = await token.setDataBatch(encodedMetadata.keys, encodedMetadata.values);
  const receipt = await tx.wait();

  console.log("Metadata updated successfully. Transaction receipt:", receipt);
}

attachAssetMetadata("0xe19d8b035cd8aCF85c360E8d12eBb1cB072ff80f")
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error updating metadata:", error);
    process.exit(1);
  });
