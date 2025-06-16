import { parseEther } from 'ethers';
import { useCallback, useState } from 'react';

import type { TransactionState } from '../types/contract';
import { useWallet } from './useWallet';

export const useContractTransactions = () => {
  const { contract, refreshContractData } = useWallet();
  const [transactionState, setTransactionState] = useState<TransactionState>({
    isLoading: false,
    hash: null,
    error: null,
  });

  const executeTransaction = useCallback(
    async (transactionFn: () => Promise<any>, _description: string) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      setTransactionState({
        isLoading: true,
        hash: null,
        error: null,
      });

      try {
        const tx = await transactionFn();
        setTransactionState({
          isLoading: true,
          hash: tx.hash,
          error: null,
        });

        await tx.wait();

        // Refresh contract data after successful transaction
        await refreshContractData();

        setTransactionState({
          isLoading: false,
          hash: tx.hash,
          error: null,
        });

        return tx;
      } catch (error: any) {
        const errorMessage = error.reason || error.message || 'Transaction failed';
        setTransactionState({
          isLoading: false,
          hash: null,
          error: errorMessage,
        });
        throw new Error(errorMessage);
      }
    },
    [contract, refreshContractData],
  );

  const setAllowance = useCallback(
    async (userAddress: string, amount: string) => {
      const amountWei = parseEther(amount);
      return executeTransaction(
        () => contract!.setAllowance(userAddress, amountWei),
        `Setting allowance for ${userAddress}`,
      );
    },
    [contract, executeTransaction],
  );

  const withdraw = useCallback(
    async (toAddress: string, amount: string) => {
      const amountWei = parseEther(amount);
      return executeTransaction(
        () => contract!.withdraw(toAddress, amountWei),
        `Withdrawing ${amount} ETH to ${toAddress}`,
      );
    },
    [contract, executeTransaction],
  );

  const deposit = useCallback(
    async (amount: string) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const amountWei = parseEther(amount);
      const signer = contract.runner;

      if (!signer || !('sendTransaction' in signer)) {
        throw new Error('Signer not available');
      }

      return executeTransaction(
        () =>
          (signer as any).sendTransaction({
            to: contract.target,
            value: amountWei,
          }),
        `Depositing ${amount} ETH`,
      );
    },
    [contract, executeTransaction],
  );

  const clearTransactionState = useCallback(() => {
    setTransactionState({
      isLoading: false,
      hash: null,
      error: null,
    });
  }, []);

  return {
    ...transactionState,
    setAllowance,
    withdraw,
    deposit,
    clearTransactionState,
  };
};
