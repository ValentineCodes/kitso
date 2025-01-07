import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import path from 'path';

import { attachAssetMetadata } from '../scripts/attachAssetMetadata';

// Deploy mock LSP7 and LSP8 contracts
const deployMocks: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const imagePath = path.join(__dirname, '../assets/images/token.jpeg');

  // Deploy MockLSP7
  const mockLSP7 = await deploy('MockLSP7', {
    from: deployer,
    args: ['Mock LSP7 Token', 'MLSP7', deployer],
    log: true,
    autoMine: true
  });

  // await attachAssetMetadata(mockLSP7.address, imagePath);

  // Deploy MockLSP8
  const mockLSP8 = await deploy('MockLSP8', {
    from: deployer,
    args: ['Mock LSP8 Token', 'MLSP8', deployer],
    log: true,
    autoMine: true
  });

  // await attachAssetMetadata(mockLSP8.address, imagePath);

  console.log('Mocks Deployed! 🎉');
};

export default deployMocks;

// Tags for the deployment script
deployMocks.tags = ['MockLSP7', 'MockLSP8'];
