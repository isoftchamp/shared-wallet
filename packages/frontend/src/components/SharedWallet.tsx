import { useState } from 'react';

import { Badge, Button, Card, Input, StatCard } from '@/components/ui';
import { useContractTransactions, useWallet } from '@/hooks';
import { cn, formatAddress, formatEthValue, isValidAddress, isValidEthAmount } from '@/utils';

export const SharedWallet = () => {
  const {
    account,
    isConnected,
    isOwner,
    contractBalance,
    userAllowance,
    isLoading: walletLoading,
    error: walletError,
    connectWallet,
    disconnectWallet,
    refreshContractData,
    clearError,
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
      <Card
        className={cn(
          'animate-slide-down',
          txLoading && 'border-accent-200 bg-gradient-to-r from-accent-50 to-amber-50',
          txError && 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50',
          txHash &&
            !txLoading &&
            'border-secondary-200 bg-gradient-to-r from-secondary-50 to-emerald-50',
        )}
      >
        {txLoading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 text-accent-600" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-accent-900">Transaction Pending</h4>
              <p className="text-sm text-accent-700">
                Please wait while your transaction is processed...
              </p>
            </div>
          </div>
        )}
        {txError && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">Transaction Failed</h4>
                <p className="text-sm text-red-700 mt-1">{txError}</p>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={clearTransactionState}>
              Clear Error
            </Button>
          </div>
        )}
        {txHash && !txLoading && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="h-4 w-4 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900">Transaction Successful!</h4>
                <p className="text-xs font-mono text-secondary-700 mt-1 break-all bg-white/50 p-2 rounded">
                  {txHash}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={clearTransactionState}>
              Clear
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-accent-200/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-8 shadow-glow animate-glow">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-6xl md:text-7xl font-display font-bold gradient-text mb-6 animate-fade-in">
            Shared Wallet
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed text-balance">
            Experience the future of decentralized finance with our premium shared wallet solution,
            featuring advanced allowance controls and seamless Ethereum integration.
          </p>
        </div>

        {/* Wallet Connection */}
        <Card variant="premium" className="mb-8 animate-slide-up">
          {!isConnected ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-3">
                Connect Your Wallet
              </h3>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                Connect your MetaMask wallet to start managing your shared funds with advanced
                security features.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleConnect}
                loading={walletLoading}
                className="shadow-glow hover:shadow-glow-lg"
              >
                {walletLoading ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-secondary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-neutral-900 mb-2">
                Wallet Connected
              </h3>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <code className="px-3 py-1 bg-neutral-100 rounded-lg text-sm font-mono text-neutral-700">
                  {formatAddress(account!)}
                </code>
                {isOwner && (
                  <Badge variant="success" size="md">
                    👑 Owner
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
          )}
        </Card>

        {/* Wallet Error Display */}
        {walletError && (
          <Card className="mb-8 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 animate-slide-down">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Connection Error</h3>
                <p className="text-red-700 mb-4">{walletError}</p>
                <div className="flex space-x-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleConnect}
                    loading={walletLoading}
                  >
                    {walletLoading ? 'Retrying...' : 'Try Again'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearError}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {isConnected && (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard
                variant="gradient"
                color="blue"
                title="Contract Balance"
                value={`${formatEthValue(contractBalance)} ETH`}
                subtitle="Total funds in wallet"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                }
                className="animate-slide-up"
              />
              <StatCard
                variant="gradient"
                color="green"
                title="Your Allowance"
                value={`${formatEthValue(userAllowance)} ETH`}
                subtitle="Available to withdraw"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                className="animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              />
              <StatCard
                variant="gradient"
                color="purple"
                title="Your Role"
                value={isOwner ? 'Owner' : 'User'}
                subtitle={isOwner ? 'Full access' : 'Limited access'}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                className="animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              />
              <StatCard
                variant="gradient"
                color="amber"
                title="Quick Actions"
                value=""
                subtitle="Refresh data"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                className="animate-slide-up cursor-pointer hover:scale-105 transition-transform"
                style={{ animationDelay: '0.3s' }}
                onClick={refreshContractData}
              />
            </div>

            {/* Action Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
              {/* Deposit Panel */}
              <Card
                variant="premium"
                className="animate-slide-up"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-secondary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-neutral-900">
                      Deposit ETH
                    </h3>
                    <p className="text-sm text-neutral-600">Add funds to the shared wallet</p>
                  </div>
                </div>
                <form onSubmit={handleDeposit} className="space-y-6">
                  <Input
                    label="Amount (ETH)"
                    type="number"
                    step="0.001"
                    placeholder="0.0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    disabled={txLoading}
                    rightIcon={<span className="text-xs font-semibold text-neutral-500">ETH</span>}
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled={txLoading || !isValidEthAmount(depositAmount)}
                    loading={txLoading}
                  >
                    Deposit ETH
                  </Button>
                </form>
              </Card>

              {/* Withdraw Panel */}
              <Card
                variant="premium"
                className="animate-slide-up"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-neutral-900">
                      Withdraw ETH
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {isOwner ? 'Unlimited access' : `Up to ${formatEthValue(userAllowance)} ETH`}
                    </p>
                  </div>
                </div>
                <form onSubmit={handleWithdraw} className="space-y-6">
                  <Input
                    label="Recipient Address"
                    type="text"
                    placeholder="0x..."
                    value={withdrawForm.address}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, address: e.target.value })}
                    disabled={txLoading}
                    error={
                      withdrawForm.address && !isValidAddress(withdrawForm.address)
                        ? 'Invalid address format'
                        : undefined
                    }
                  />
                  <Input
                    label="Amount (ETH)"
                    type="number"
                    step="0.001"
                    placeholder="0.0"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    disabled={txLoading}
                    error={
                      withdrawForm.amount && !isValidEthAmount(withdrawForm.amount)
                        ? 'Invalid amount'
                        : undefined
                    }
                    rightIcon={<span className="text-xs font-semibold text-neutral-500">ETH</span>}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={
                      txLoading ||
                      !isValidAddress(withdrawForm.address) ||
                      !isValidEthAmount(withdrawForm.amount)
                    }
                    loading={txLoading}
                  >
                    Withdraw ETH
                  </Button>
                </form>
              </Card>

              {/* Owner Panel */}
              {isOwner && (
                <Card
                  variant="premium"
                  className="animate-slide-up"
                  style={{ animationDelay: '0.6s' }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-amber-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-accent-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold text-neutral-900">
                        Owner Controls
                      </h3>
                      <p className="text-sm text-neutral-600">Manage user allowances</p>
                    </div>
                  </div>
                  <form onSubmit={handleSetAllowance} className="space-y-6">
                    <Input
                      label="User Address"
                      type="text"
                      placeholder="0x..."
                      value={allowanceForm.address}
                      onChange={(e) =>
                        setAllowanceForm({ ...allowanceForm, address: e.target.value })
                      }
                      disabled={txLoading}
                      error={
                        allowanceForm.address && !isValidAddress(allowanceForm.address)
                          ? 'Invalid address format'
                          : undefined
                      }
                    />
                    <Input
                      label="Allowance (ETH)"
                      type="number"
                      step="0.001"
                      placeholder="0.0"
                      value={allowanceForm.amount}
                      onChange={(e) =>
                        setAllowanceForm({ ...allowanceForm, amount: e.target.value })
                      }
                      disabled={txLoading}
                      error={
                        allowanceForm.amount && !isValidEthAmount(allowanceForm.amount)
                          ? 'Invalid amount'
                          : undefined
                      }
                      rightIcon={
                        <span className="text-xs font-semibold text-neutral-500">ETH</span>
                      }
                    />
                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      className="w-full"
                      disabled={
                        txLoading ||
                        !isValidAddress(allowanceForm.address) ||
                        !isValidEthAmount(allowanceForm.amount)
                      }
                      loading={txLoading}
                    >
                      Set Allowance
                    </Button>
                  </form>
                </Card>
              )}
            </div>

            {/* Transaction Status */}
            <TransactionStatus />
          </>
        )}
      </div>
    </div>
  );
};
