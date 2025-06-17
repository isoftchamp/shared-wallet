import SharedWalletArtifact from '@contracts/artifacts/contracts/SharedWallet.sol/SharedWallet.json';

export const SHARED_WALLET_ABI = SharedWalletArtifact.abi;

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS_SEPOLIA;

// Supported networks
export const SUPPORTED_NETWORKS = {
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
  },
};

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS.sepolia;
