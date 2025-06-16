import { formatEther, parseEther } from 'ethers';

export const formatEthValue = (value: bigint, decimals: number = 4): string => {
  const formatted = formatEther(value);
  const num = parseFloat(formatted);
  return num.toFixed(decimals);
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const isValidEthAmount = (amount: string): boolean => {
  try {
    const parsed = parseFloat(amount);
    return parsed > 0 && !isNaN(parsed);
  } catch {
    return false;
  }
};

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const parseEthInput = (amount: string): bigint => {
  try {
    return parseEther(amount);
  } catch {
    throw new Error('Invalid ETH amount');
  }
};
