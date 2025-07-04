import { ContractTransactionResponse } from 'ethers';

export interface SharedWalletContract {
  owner(): Promise<string>;
  allowances(address: string): Promise<bigint>;
  setAllowance(user: string, amount: bigint): Promise<ContractTransactionResponse>;
  withdraw(to: string, amount: bigint): Promise<ContractTransactionResponse>;
  getBalance(): Promise<bigint>;
}

export interface WalletState {
  account: string | null;
  isConnected: boolean;
  isOwner: boolean;
  contractBalance: bigint;
  userAllowance: bigint;
  isLoading: boolean;
  error: string | null;
}

export interface WalletError {
  code: number;
  message: string;
  type: 'connection' | 'transaction' | 'network';
}

export interface TransactionState {
  isLoading: boolean;
  hash: string | null;
  error: string | null;
}
