import { AbiCoder, Contract, ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';
import { Request, Response } from 'express';
import dotenv from "dotenv"

// Load env vars
dotenv.config();

// LSPs artifacts
import LSP23FactoryArtifact from '@lukso/lsp-smart-contracts/artifacts/LSP23LinkedContractsFactory.json' with { type: 'json' };
import UniversalProfileInitArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfileInit.json' with { type: 'json' };

// ERC725.js schemas
import LSP1UniversalReceiverDelegateSchemas from '@erc725/erc725.js/schemas/LSP1UniversalReceiverDelegate.json' with { type: 'json' };
import LSP3ProfileMetadataSchemas from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json' with { type: 'json' };
import LSP6KeyManagerSchemas from '@erc725/erc725.js/schemas/LSP6KeyManager.json' with { type: 'json' };
import { SERVER_ERROR, SUCCESS } from '../../utils/status_code.ts';
import { generateSalt } from '../../utils/helpers.ts';

const LSP23_FACTORY_ADDRESS = '0x2300000A84D25dF63081feAa37ba6b62C4c89a30';
const LSP23_POST_DEPLOYMENT_MODULE =
  '0x000000000066093407b6704B89793beFfD0D8F00';
const UNIVERSAL_PROFILE_IMPLEMENTATION_ADDRESS =
  '0x3024D38EA2434BA6635003Dc1BDC0daB5882ED4F';
const LSP6_KEY_MANAGER_IMPLEMENTATION_ADDRESS =
  '0x2Fe3AeD98684E7351aD2D408A43cE09a738BF8a4';

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

export async function createProfile(req: Request, res: Response) {
  try{
    const {
      lsp3DataValue,
      mainController,
      universalReceiverAddress
    } = req.body;
    
// Set up the provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Set up the signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider); 

// Interacting with the LSP23Factory contract
const lsp23FactoryContract = new Contract(
  LSP23_FACTORY_ADDRESS,
  LSP23FactoryArtifact.abi,
  signer,
);

// Interacting with the UniversalProfileImplementation contract
const universalProfileImplementationContract = new Contract(
  UNIVERSAL_PROFILE_IMPLEMENTATION_ADDRESS,
  UniversalProfileInitArtifact.abi,
  signer,
);

// create the init structs
const universalProfileInitStruct = {
  salt: generateSalt(),
  fundingAmount: 0,
  implementationContract: UNIVERSAL_PROFILE_IMPLEMENTATION_ADDRESS,
  initializationCalldata:
    universalProfileImplementationContract.interface.encodeFunctionData(
      'initialize',
      [LSP23_POST_DEPLOYMENT_MODULE],
    ), // this will call the `initialize(...)` function of the Universal Profile and the the LSP23_POST_DEPLOYMENT_MODULE as owner
};

const keyManagerInitStruct = {
  fundingAmount: 0,
  implementationContract: LSP6_KEY_MANAGER_IMPLEMENTATION_ADDRESS,
  addPrimaryContractAddress: true, // this will append the primary contract address to the init calldata
  initializationCalldata: '0xc4d66de8', // `initialize(...)` function selector
  extraInitializationParams: '0x',
};

// instantiate the erc725 class
const erc725 = new ERC725([
  ...LSP6KeyManagerSchemas,
  ...LSP3ProfileMetadataSchemas,
  ...LSP1UniversalReceiverDelegateSchemas,
]);
// create the permissions data keys
const setDataKeysAndValues = erc725.encodeData([
  { keyName: 'LSP3Profile', value: lsp3DataValue }, // LSP3Metadata data key and value
  {
    keyName: 'LSP1UniversalReceiverDelegate',
    value: universalReceiverAddress,
  }, // Universal Receiver data key and value
  {
    keyName: 'AddressPermissions:Permissions:<address>',
    dynamicKeyParts: [universalReceiverAddress],
    value: erc725.encodePermissions({
      REENTRANCY: true,
      SUPER_SETDATA: true,
    }),
  }, // Universal Receiver Delegate permissions data key and value
  {
    keyName: 'AddressPermissions:Permissions:<address>',
    dynamicKeyParts: [mainController],
    value: erc725.encodePermissions({
      CHANGEOWNER: true,
      ADDCONTROLLER: true,
      EDITPERMISSIONS: true,
      ADDEXTENSIONS: true,
      CHANGEEXTENSIONS: true,
      ADDUNIVERSALRECEIVERDELEGATE: true,
      CHANGEUNIVERSALRECEIVERDELEGATE: true,
      REENTRANCY: false,
      SUPER_TRANSFERVALUE: true,
      TRANSFERVALUE: true,
      SUPER_CALL: true,
      CALL: true,
      SUPER_STATICCALL: true,
      STATICCALL: true,
      SUPER_DELEGATECALL: false,
      DELEGATECALL: false,
      DEPLOY: true,
      SUPER_SETDATA: true,
      SETDATA: true,
      ENCRYPT: true,
      DECRYPT: true,
      SIGN: true,
      EXECUTE_RELAY_CALL: true,
    }), // Main Controller permissions data key and value
  },
  // length of the Address Permissions array and their respective indexed keys and values
  {
    keyName: 'AddressPermissions[]',
    value: [universalReceiverAddress, mainController],
  },
]);

const abiCoder = new AbiCoder();
const types = ['bytes32[]', 'bytes[]']; // types of the parameters

const initializeEncodedBytes = abiCoder.encode(types, [
  setDataKeysAndValues.keys,
  setDataKeysAndValues.values,
]);

// deploy the Universal Profile and its Key Manager
const [upAddress, keyManagerAddress] =
  await lsp23FactoryContract.deployERC1167Proxies.staticCall(
    universalProfileInitStruct,
    keyManagerInitStruct,
    LSP23_POST_DEPLOYMENT_MODULE,
    initializeEncodedBytes,
  );

  console.log('📝 Universal Profile address => ', upAddress);
  console.log('📝 Key Manager address => ', keyManagerAddress);

  console.log("⏳ Deploying contracts...")
  
  const tx = await lsp23FactoryContract.deployERC1167Proxies(
    universalProfileInitStruct,
    keyManagerInitStruct,
    LSP23_POST_DEPLOYMENT_MODULE,
    initializeEncodedBytes,
  );
  await tx.wait(1);

  console.log("✅ Successfully deployed Universal Profile and Key Manager!🎉")

return res.status(SUCCESS).json({
  universalProfileAddress: upAddress,
  keyManagerAddress: keyManagerAddress
})
  } catch(error) {
    console.log("❌deployment failed!")
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}