import {createSlice} from '@reduxjs/toolkit';
import {LOCAL_PROVIDER} from '../../utils/constants';

export interface Network {
  name: string;
  id: number;
  provider: string;
  ipfsGateway: string;
  token: string;
  blockExplorer: string | null;
  isConnected: boolean;
  txApiDomain: string | null;
  txApiKey: string | null
}

export const networks: Network[] = [
    {
        name: 'Localhost',
        id: 31337,
        provider: LOCAL_PROVIDER,
        token: 'LYX',
        ipfsGateway: "https://api.universalprofile.cloud/ipfs/",
        blockExplorer: null,
        isConnected: true,
        txApiDomain: null,
        txApiKey: null
      },
    {
        name: "LUKSO Mainnet",
        id: 42,
        provider: "https://42.rpc.thirdweb.com",
        token: "LYX",
        ipfsGateway: "https://api.universalprofile.cloud/ipfs/",
        blockExplorer: "https://explorer.execution.mainnet.lukso.network/",
        isConnected: true,
        txApiDomain: null,
        txApiKey: null
      },
      {
        name: "LUKSO Testnet",
        id: 4201,
        provider: "https://4201.rpc.thirdweb.com",
        token: "LYXt",
        ipfsGateway: "https://api.universalprofile.cloud/ipfs/",
        blockExplorer: "https://explorer.execution.testnet.lukso.network/",
        isConnected: false,
        txApiDomain: null,
        txApiKey: null
      },
];

export const networksSlice = createSlice({
  name: 'NETWORKS',
  initialState: networks,
  reducers: {
    addNetwork: (state, action) => {
      return [...state, action.payload];
    },
    switchNetwork: (state, action) => {
      // action.payload => network id
      return state.map(network => {
        if (network.id === Number(action.payload)) {
          return {...network, isConnected: true};
        } else {
          return {...network, isConnected: false};
        }
      });
    },
  },
});

export const {addNetwork, switchNetwork} = networksSlice.actions;

export default networksSlice.reducer;
