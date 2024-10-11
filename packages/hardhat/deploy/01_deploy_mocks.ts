import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

// Deploy mock LSP7 and LSP8 contracts
const deployMocks: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy MockLSP7
  await deploy("MockLSP7", {
    from: deployer,
    args: ["Mock LSP7 Token", "MLSP7", deployer],
    log: true,
    autoMine: true,
  });

  // Deploy MockLSP8
  await deploy("MockLSP8", {
    from: deployer,
    args: ["Mock LSP8 Token", "MLSP8", deployer],
    log: true,
    autoMine: true,
  });
};

export default deployMocks;

// Tags for the deployment script
deployMocks.tags = ["MockLSP7", "MockLSP8"];
