import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserProvider, Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { CONTRACT_ADDRESS_SEPOLIA, SHARED_WALLET_ABI } from '@/contracts';
import type { WalletState } from '@/interfaces';

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    isConnected: false,
    isOwner: false,
    contractBalance: 0n,
    userAllowance: 0n,
    isLoading: false,
    error: null,
  });

  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // Initialize provider and contract
  const initializeProvider = useCallback(async () => {
    try {
      const ethereumProvider = await detectEthereumProvider();
      if (ethereumProvider && window.ethereum) {
        const browserProvider = new BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        const signer = await browserProvider.getSigner();
        const contractInstance = new Contract(CONTRACT_ADDRESS_SEPOLIA, SHARED_WALLET_ABI, signer);
        setContract(contractInstance);

        return { browserProvider, contractInstance };
      }
      return null;
    } catch (error) {
      console.error('Failed to initialize provider:', error);
      return null;
    }
  }, []);

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: any): string => {
    if (error.code === 4001) {
      return 'Connection cancelled. Please approve the connection request in MetaMask to continue.';
    }
    if (error.code === -32002) {
      return 'Connection request pending. Please check MetaMask for a pending connection request.';
    }
    if (error.message?.includes('MetaMask not found')) {
      return 'MetaMask not detected. Please install MetaMask browser extension.';
    }
    if (error.message?.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    return error.message || 'Failed to connect wallet. Please try again.';
  };

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const initialized = await initializeProvider();
      if (!initialized) {
        throw new Error('MetaMask not found');
      }

      const { browserProvider, contractInstance } = initialized;

      // Request account access
      await window.ethereum!.request({ method: 'eth_requestAccounts' });

      const signer = await browserProvider.getSigner();
      const account = await signer.getAddress();

      // Get contract owner
      const owner = await contractInstance.owner();
      const isOwner = account.toLowerCase() === owner.toLowerCase();

      // Get contract balance
      const contractBalance = await contractInstance.getBalance();

      // Get user allowance
      const userAllowance = await contractInstance.allowances(account);

      setWalletState({
        account,
        isConnected: true,
        isOwner,
        contractBalance,
        userAllowance,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to connect wallet:', error);
      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      // Don't throw the error anymore - let the UI handle it gracefully
    }
  }, [initializeProvider]);

  // Clear wallet error
  const clearError = useCallback(() => {
    setWalletState((prev) => ({ ...prev, error: null }));
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      account: null,
      isConnected: false,
      isOwner: false,
      contractBalance: 0n,
      userAllowance: 0n,
      isLoading: false,
      error: null,
    });
    setProvider(null);
    setContract(null);
  }, []);

  // Refresh contract data
  const refreshContractData = useCallback(async () => {
    if (!contract || !walletState.account) return;

    try {
      const contractBalance = await contract.getBalance();
      const userAllowance = await contract.allowances(walletState.account);

      setWalletState((prev) => ({
        ...prev,
        contractBalance,
        userAllowance,
      }));
    } catch (error) {
      console.error('Failed to refresh contract data:', error);
    }
  }, [contract, walletState.account]);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== walletState.account) {
          // Reconnect with new account
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum!.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum!.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletState.account, connectWallet, disconnectWallet]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = (await window.ethereum.request({ method: 'eth_accounts' })) as string[];
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Failed to check connection:', error);
        }
      }
    };

    checkConnection();
  }, [connectWallet]);

  return {
    ...walletState,
    provider,
    contract,
    connectWallet,
    disconnectWallet,
    refreshContractData,
    clearError,
  };
};
