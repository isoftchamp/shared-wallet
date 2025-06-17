# Shared Wallet - Premium DeFi Wallet Management

Experience the future of decentralized finance with our premium shared wallet solution, featuring advanced allowance controls and seamless Ethereum integration.

![Shared Wallet](https://img.shields.io/badge/DeFi-Shared%20Wallet-blue?style=for-the-badge&logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)

## 🌟 Features

- **🔐 Secure Shared Wallet**: Multi-user wallet with owner-controlled allowances
- **💎 Premium UI/UX**: Modern, responsive design with glassmorphism effects
- **⚡ Real-time Updates**: Live balance and transaction status updates
- **🎨 Advanced Animations**: Smooth micro-interactions and loading states
- **📱 Mobile-First**: Optimized for all devices with PWA support
- **🔧 Developer-Friendly**: TypeScript, ESLint, Prettier, and modern tooling
- **🚀 Production-Ready**: Optimized for deployment on Vercel and other platforms

## 🏗️ Architecture

This project is a monorepo containing:

```
shared-wallet/
├── packages/
│   ├── contracts/          # Smart contracts (Hardhat)
│   └── frontend/           # React frontend (Vite + TypeScript)
├── README.md
└── package.json
```

### Smart Contracts
- **SharedWallet.sol**: Main contract with allowance-based access control
- Owner can set allowances for users
- Users can withdraw up to their allowed amount
- Owner has unlimited access

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS v4** with custom design system
- **Vite** for fast development and building
- **Ethers.js** for blockchain interaction
- **MetaMask** integration for wallet connection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shared-wallet
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   **For contracts:**
   ```bash
   cd packages/contracts
   cp .env.example .env
   # Edit .env with your values
   ```
   
   **For frontend:**
   ```bash
   cd packages/frontend
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

### Development

1. **Compile and deploy contracts**
   ```bash
   cd packages/contracts
   yarn compile
   yarn deploy
   ```

2. **Start the frontend**
   ```bash
   cd packages/frontend
   yarn dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Deployment

### Smart Contracts

Deploy to Sepolia testnet:
```bash
cd packages/contracts
yarn deploy
```

The deployment script will:
- Deploy the SharedWallet contract
- Copy contract ABIs to the frontend
- Display the contract address

### Frontend

The frontend is optimized for deployment on Vercel:

1. **Build the frontend**
   ```bash
   cd packages/frontend
   yarn build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set the build command: `cd packages/frontend && yarn build`
   - Set the output directory: `packages/frontend/dist`
   - Add environment variables in Vercel dashboard

### Environment Variables

**Frontend (.env.local):**
```env
VITE_CONTRACT_ADDRESS_SEPOLIA=0x...
VITE_INFURA_KEY=your_infura_key
```

**Contracts (.env):**
```env
SEPOLIA_PRIVATE_KEY=your_private_key
INFURA_KEY=your_infura_key
```

## 🛠️ Development Scripts

### Root Level
```bash
yarn install          # Install all dependencies
```

### Contracts Package
```bash
yarn compile          # Compile contracts and copy ABIs
yarn test             # Run contract tests
yarn deploy           # Deploy to configured network
yarn copy-artifacts   # Copy ABIs to frontend
yarn lint             # Lint Solidity files
yarn format           # Format all files
```

### Frontend Package
```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn preview          # Preview production build
yarn lint             # Lint TypeScript/React files
yarn format           # Format all files
```

## 🎨 Design System

The frontend features a comprehensive design system built with Tailwind CSS v4:

### Color Palette
- **Primary**: Blue gradient (#2563eb to #1e3a8a)
- **Secondary**: Emerald to teal (#059669 to #0d9488)
- **Accent**: Amber (#f59e0b) for highlights
- **Neutral**: Sophisticated grays with blue undertones

### Typography
- **Primary**: Inter font for body text
- **Display**: Clash Display for headings
- **Mono**: JetBrains Mono for addresses/hashes

### Components
- **Atomic Design**: Atoms, molecules, and organisms
- **Glassmorphism**: Cards with backdrop blur effects
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## 🔧 Technical Details

### Smart Contract Features
- **Owner Management**: Contract deployer becomes the owner
- **Allowance System**: Owner can set spending limits for users
- **Secure Withdrawals**: Users can only withdraw up to their allowance
- **Direct Deposits**: Anyone can deposit ETH to the contract
- **Balance Tracking**: Real-time balance monitoring

### Frontend Features
- **Wallet Integration**: MetaMask connection with error handling
- **Real-time Updates**: Live balance and allowance tracking
- **Transaction Management**: Status tracking with retry functionality
- **Form Validation**: Real-time validation for addresses and amounts
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **PWA Support**: Progressive Web App capabilities

### Security Considerations
- **Input Validation**: Client and contract-level validation
- **Error Handling**: Comprehensive error messages and recovery
- **Access Control**: Role-based permissions (owner vs user)
- **Safe Math**: Built-in overflow protection in Solidity

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for smart contracts
- Follow atomic design principles for components
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hardhat](https://hardhat.org/) for smart contract development
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Ethers.js](https://docs.ethers.io/) for blockchain interaction
- [Vite](https://vitejs.dev/) for fast development builds

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ for the DeFi community**
