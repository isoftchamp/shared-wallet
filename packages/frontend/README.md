# SharedWallet Frontend

A React frontend for interacting with the SharedWallet smart contract, built with TypeScript, Tailwind CSS, and ethers.js.

## Features

- **MetaMask Integration**: Connect your wallet to interact with the contract
- **Owner Dashboard**: Set allowances for users (owner only)
- **User Dashboard**: View allowance and withdraw funds
- **Deposit Functionality**: Send ETH to the shared wallet
- **Real-time Updates**: Automatic balance and allowance updates
- **Transaction Tracking**: Monitor transaction status with hash display
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js 18+
- MetaMask browser extension
- A deployed SharedWallet contract

## Setup

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Configure contract address**:
   Update `src/contracts/config.ts` with your deployed contract address:
   ```typescript
   export const CONTRACT_ADDRESS = "0xYourContractAddress";
   ```

3. **Start development server**:
   ```bash
   yarn dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

## Usage

### Connecting Your Wallet

1. Click "Connect MetaMask" button
2. Approve the connection in MetaMask
3. Ensure you're on the correct network (localhost for development)

### For Contract Owner

- **Set Allowances**: Grant spending permissions to other addresses
- **Unlimited Withdrawals**: Withdraw any amount without allowance restrictions
- **View All Data**: Monitor contract balance and user allowances

### For Regular Users

- **View Allowance**: See how much ETH you're allowed to withdraw
- **Withdraw Funds**: Send ETH from the contract to any address (within allowance)
- **Check Balance**: Monitor the total contract balance

### For All Users

- **Deposit ETH**: Send ETH to the shared wallet contract
- **Transaction Monitoring**: Track pending and completed transactions
- **Real-time Updates**: Automatic refresh of balances and allowances

## Contract Interaction

The frontend interacts with the following contract functions:

- `owner()`: Get contract owner address
- `allowances(address)`: Get user's allowance
- `setAllowance(address, amount)`: Set user allowance (owner only)
- `withdraw(address, amount)`: Withdraw ETH
- `getBalance()`: Get contract balance
- `receive()`: Deposit ETH to contract

## Development

### Project Structure

```
src/
├── components/          # React components
│   └── SharedWallet.tsx # Main wallet interface
├── contracts/           # Contract configuration
│   └── config.ts       # ABI and contract address
├── hooks/              # Custom React hooks
│   ├── useWallet.ts    # Wallet connection logic
│   └── useContractTransactions.ts # Transaction handling
├── types/              # TypeScript type definitions
│   ├── contract.ts     # Contract-related types
│   └── global.d.ts     # Global type declarations
├── utils/              # Utility functions
│   └── format.ts       # Formatting helpers
└── App.tsx             # Main app component
```

### Key Technologies

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **ethers.js**: Ethereum interaction
- **Vite**: Build tool and dev server

### Custom Hooks

- **useWallet**: Manages MetaMask connection, account state, and contract initialization
- **useContractTransactions**: Handles contract method calls and transaction states

## Building for Production

```bash
yarn build
```

The built files will be in the `dist/` directory.

## Troubleshooting

### Common Issues

1. **MetaMask not detected**:
   - Ensure MetaMask extension is installed and enabled
   - Refresh the page and try again

2. **Wrong network**:
   - Switch to the correct network in MetaMask
   - For local development, add localhost:8545 network

3. **Transaction failures**:
   - Check you have sufficient ETH for gas fees
   - Verify contract address is correct
   - Ensure you have proper allowances (for non-owners)

4. **Contract not found**:
   - Verify the contract address in `config.ts`
   - Ensure the contract is deployed on the current network

### Network Configuration

For local development with Hardhat:

```json
{
  "chainId": 31337,
  "name": "Localhost",
  "rpcUrl": "http://127.0.0.1:8545"
}
```

## Security Considerations

- Always verify contract addresses before interacting
- Double-check transaction details before confirming
- Only connect to trusted websites
- Keep your private keys secure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
