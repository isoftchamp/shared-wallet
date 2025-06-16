import { useState } from 'react';

import { useContractTransactions } from '../hooks/useContractTransactions';
import { useWallet } from '../hooks/useWallet';
import { formatAddress, formatEthValue, isValidAddress, isValidEthAmount } from '../utils/format';

export const SharedWallet = () => {
  const {
    account,
    isConnected,
    isOwner,
    contractBalance,
    userAllowance,
    isLoading: walletLoading,
    connectWallet,
    disconnectWallet,
    refreshContractData,
  } = useWallet();

  const {
    isLoading: txLoading,
    hash: txHash,
    error: txError,
    setAllowance,
    withdraw,
    deposit,
    clearTransactionState,
  } = useContractTransactions();

  // Form states
  const [allowanceForm, setAllowanceForm] = useState({ address: '', amount: '' });
  const [withdrawForm, setWithdrawForm] = useState({ address: '', amount: '' });
  const [depositAmount, setDepositAmount] = useState('');

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleSetAllowance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(allowanceForm.address) || !isValidEthAmount(allowanceForm.amount)) {
      return;
    }

    try {
      await setAllowance(allowanceForm.address, allowanceForm.amount);
      setAllowanceForm({ address: '', amount: '' });
    } catch (error) {
      console.error('Failed to set allowance:', error);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(withdrawForm.address) || !isValidEthAmount(withdrawForm.amount)) {
      return;
    }

    try {
      await withdraw(withdrawForm.address, withdrawForm.amount);
      setWithdrawForm({ address: '', amount: '' });
    } catch (error) {
      console.error('Failed to withdraw:', error);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEthAmount(depositAmount)) {
      return;
    }

    try {
      await deposit(depositAmount);
      setDepositAmount('');
    } catch (error) {
      console.error('Failed to deposit:', error);
    }
  };

  const TransactionStatus = () => {
    if (!txLoading && !txHash && !txError) return null;

    return (
      <div
        className={`mt-6 p-4 rounded-lg border ${
          txLoading
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
            : txError
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-green-50 border-green-200 text-green-800'
        }`}
      >
        {txLoading && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            Transaction pending...
          </div>
        )}
        {txError && (
          <div>
            <div className="font-medium">Transaction failed: {txError}</div>
            <button
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              onClick={clearTransactionState}
            >
              Clear
            </button>
          </div>
        )}
        {txHash && !txLoading && (
          <div>
            <div className="font-medium">Transaction successful!</div>
            <div className="text-xs font-mono mt-1 break-all">Hash: {txHash}</div>
            <button
              className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              onClick={clearTransactionState}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shared Wallet</h1>
        <p className="text-gray-600">A decentralized wallet with allowance-based access control</p>
      </div>

      {/* Wallet Connection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {!isConnected ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Connect your wallet to interact with the Shared Wallet contract
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              onClick={handleConnect}
              disabled={walletLoading}
            >
              {walletLoading ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              Connected: <span className="font-mono">{formatAddress(account!)}</span>
              {isOwner && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  OWNER
                </span>
              )}
            </p>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {isConnected && (
        <>
          {/* Wallet Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Contract Balance
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {formatEthValue(contractBalance)} ETH
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Your Allowance
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {formatEthValue(userAllowance)} ETH
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Your Role
              </h3>
              <div className="text-2xl font-bold text-gray-900">{isOwner ? 'Owner' : 'User'}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Actions
              </h3>
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded text-sm transition-colors"
                onClick={refreshContractData}
              >
                Refresh Data
              </button>
            </div>
          </div>

          {/* Main Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Deposit Panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                💰 Deposit ETH
              </h2>
              <p className="text-gray-600 mb-4">Send ETH to the shared wallet contract</p>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label
                    htmlFor="deposit-amount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Amount (ETH)
                  </label>
                  <input
                    id="deposit-amount"
                    type="number"
                    step="0.001"
                    placeholder="0.0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    disabled={txLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  disabled={txLoading || !isValidEthAmount(depositAmount)}
                >
                  {txLoading ? 'Processing...' : 'Deposit ETH'}
                </button>
              </form>
            </div>

            {/* Withdraw Panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                💸 Withdraw ETH
              </h2>
              <p className="text-gray-600 mb-4">
                {isOwner
                  ? 'As owner, you can withdraw any amount'
                  : `You can withdraw up to ${formatEthValue(userAllowance)} ETH`}
              </p>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label
                    htmlFor="withdraw-address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Recipient Address
                  </label>
                  <input
                    id="withdraw-address"
                    type="text"
                    placeholder="0x..."
                    value={withdrawForm.address}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, address: e.target.value })}
                    disabled={txLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  {withdrawForm.address && !isValidAddress(withdrawForm.address) && (
                    <div className="text-red-600 text-sm mt-1">Invalid address format</div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="withdraw-amount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Amount (ETH)
                  </label>
                  <input
                    id="withdraw-amount"
                    type="number"
                    step="0.001"
                    placeholder="0.0"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    disabled={txLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  {withdrawForm.amount && !isValidEthAmount(withdrawForm.amount) && (
                    <div className="text-red-600 text-sm mt-1">Invalid amount</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  disabled={
                    txLoading ||
                    !isValidAddress(withdrawForm.address) ||
                    !isValidEthAmount(withdrawForm.amount)
                  }
                >
                  {txLoading ? 'Processing...' : 'Withdraw ETH'}
                </button>
              </form>
            </div>

            {/* Owner Panel */}
            {isOwner && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                  👑 Owner Controls
                </h2>
                <p className="text-gray-600 mb-4">Set allowances for other users</p>
                <form onSubmit={handleSetAllowance} className="space-y-4">
                  <div>
                    <label
                      htmlFor="allowance-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      User Address
                    </label>
                    <input
                      id="allowance-address"
                      type="text"
                      placeholder="0x..."
                      value={allowanceForm.address}
                      onChange={(e) =>
                        setAllowanceForm({ ...allowanceForm, address: e.target.value })
                      }
                      disabled={txLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    {allowanceForm.address && !isValidAddress(allowanceForm.address) && (
                      <div className="text-red-600 text-sm mt-1">Invalid address format</div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="allowance-amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Allowance (ETH)
                    </label>
                    <input
                      id="allowance-amount"
                      type="number"
                      step="0.001"
                      placeholder="0.0"
                      value={allowanceForm.amount}
                      onChange={(e) =>
                        setAllowanceForm({ ...allowanceForm, amount: e.target.value })
                      }
                      disabled={txLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    {allowanceForm.amount && !isValidEthAmount(allowanceForm.amount) && (
                      <div className="text-red-600 text-sm mt-1">Invalid amount</div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    disabled={
                      txLoading ||
                      !isValidAddress(allowanceForm.address) ||
                      !isValidEthAmount(allowanceForm.amount)
                    }
                  >
                    {txLoading ? 'Processing...' : 'Set Allowance'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Transaction Status */}
          <TransactionStatus />
        </>
      )}
    </div>
  );
};
