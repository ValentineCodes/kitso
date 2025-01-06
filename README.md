<div style="display: flex; align-items: center;">
    <img src="./assets/logo.png" alt="contract debugger" style="display: inline-block; width: 50px; height: 50px;" />
    <h1 style="display: inline-block;">Kitso</h1>
</div>

🧪 An open-source, comprehensive starter kit for building decentralized applications (dApps) on the LUKSO blockchain using React Native and Foundry/Hardhat. This kit streamlines the process for developers, offering an efficient way to create, deploy, and interact with smart contracts while building intuitive user interfaces.

⚙️ Built using React Native, Hardhat, Wagmi, Viem, and Typescript.

- 💳 **In-Built Wallet:** A secure crypto wallet to manage funds, and sign transactions on LUKSO, providing a seamless and intuitive mobile experience for LUKSO users.
- ✅ **Contract Hot Reload:** Automatically updates the frontend to reflect real-time changes in smart contracts deployed on LUKSO, reducing downtime and speeding up the development process.
- 🛠️ **Contract Debugger:** A powerful tool to debug smart contracts on LUKSO, ensuring they function as expected before deployment.
- 🪝 **Custom Hooks:** A collection of TypeScript-enabled React hooks to simplify interactions with LUKSO smart contracts, enabling developers to write cleaner, more efficient code.

- 🧱 **Components:** Pre-built web3 components tailored for LUKSO, allowing developers to quickly assemble user interfaces and focus more on functionality rather than building from scratch.

![Contract Debugger](./assets/debugger.png)

## Requirements

Before you begin, you need to install the following tools:

- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)
- [Git](https://git-scm.com/downloads)
- [React Native](https://reactnative.dev/docs/environment-setup?guide=native&platform=android)
- [Yeet](https://www.npmjs.com/package/yeet-cli)

## Quickstart

To get started with Kitso, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/ValentineCodes/kitso.git

cd kitso

yarn install && yarn patch-ethers

yarn pod-install
```

Remember to run `yarn patch-ethers` to patch ethers after installing any package

2. Connect your device to your computer via WIFI-HOTSPOT

3. Run a local network in the first terminal

```
yarn chain
```

This command starts a local Ethereum network hosted on your local IP address. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

4. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

5. Set the `ALCHEMY_KEY` and `LOCAL_PROVIDER`(port **8545**) variables in `packages/reactnative/src/utils/constants.ts`

#### To determine your local IP address:

#### Mac:

```
ipconfig getifaddr en0
```

#### Windows:

```
ipconfig
```

6. Connect your device via USB or Run an emulator

7. Run on device:

#### Android

```
yarn android
```

#### IOS

```
yarn ios
```

8. Import one of the funded accounts in your local blockchain into your wallet to have funds for testing

You can interact with your smart contract using the `Debug Contracts` tab. You can tweak the app config in `packages/reactnative/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/reactnative/src/screens`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Contributing to Kitso

We welcome contributions to Kitso!

Please see [CONTRIBUTING.MD](https://github.com/ValentineCodes/kitso/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Kitso.
