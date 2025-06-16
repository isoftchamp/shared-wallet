// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  console.log('Deploying SharedWallet contract...');

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', hre.ethers.utils.formatEther(await deployer.getBalance()), 'ETH');

  // We get the contract to deploy
  const SharedWallet = await hre.ethers.getContractFactory('SharedWallet');
  const sharedWallet = await SharedWallet.deploy();

  await sharedWallet.deployed();

  console.log('SharedWallet deployed to:', sharedWallet.address);
  console.log('Owner:', await sharedWallet.owner());
  console.log(
    'Initial balance:',
    hre.ethers.utils.formatEther(await sharedWallet.getBalance()),
    'ETH',
  );

  console.log('\n=== Frontend Configuration ===');
  console.log(`Update packages/frontend/src/contracts/config.ts:`);
  console.log(`export const CONTRACT_ADDRESS = "${sharedWallet.address}";`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
