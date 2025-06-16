const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SharedWallet', function () {
  let SharedWallet;
  let sharedWallet;
  let owner;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy SharedWallet contract
    SharedWallet = await ethers.getContractFactory('SharedWallet');
    sharedWallet = await SharedWallet.deploy();
    await sharedWallet.deployed();
  });

  describe('Deployment & Initialization', function () {
    it('Should set the correct owner', async function () {
      expect(await sharedWallet.owner()).to.equal(owner.address);
    });

    it('Should have zero initial balance', async function () {
      expect(await sharedWallet.getBalance()).to.equal(0);
    });

    it('Should have zero initial allowances for all users', async function () {
      expect(await sharedWallet.allowances(user1.address)).to.equal(0);
      expect(await sharedWallet.allowances(user2.address)).to.equal(0);
      expect(await sharedWallet.allowances(user3.address)).to.equal(0);
    });
  });

  describe('Receive & Fallback Functions', function () {
    it('Should receive ETH via receive function', async function () {
      const amount = ethers.utils.parseEther('1.0');

      await owner.sendTransaction({
        to: sharedWallet.address,
        value: amount,
      });

      expect(await sharedWallet.getBalance()).to.equal(amount);
    });

    it('Should receive ETH via fallback function', async function () {
      const amount = ethers.utils.parseEther('0.5');

      await owner.sendTransaction({
        to: sharedWallet.address,
        value: amount,
        data: '0x1234', // Non-empty data triggers fallback
      });

      expect(await sharedWallet.getBalance()).to.equal(amount);
    });

    it('Should accumulate multiple deposits', async function () {
      const amount1 = ethers.utils.parseEther('1.0');
      const amount2 = ethers.utils.parseEther('0.5');

      await owner.sendTransaction({
        to: sharedWallet.address,
        value: amount1,
      });

      await user1.sendTransaction({
        to: sharedWallet.address,
        value: amount2,
      });

      expect(await sharedWallet.getBalance()).to.equal(amount1.add(amount2));
    });
  });

  describe('Owner Functionality', function () {
    it('Should allow owner to set allowances', async function () {
      const allowanceAmount = ethers.utils.parseEther('1.0');

      await sharedWallet.setAllowance(user1.address, allowanceAmount);

      expect(await sharedWallet.allowances(user1.address)).to.equal(allowanceAmount);
    });

    it('Should allow owner to update existing allowances', async function () {
      const initialAllowance = ethers.utils.parseEther('1.0');
      const updatedAllowance = ethers.utils.parseEther('2.0');

      await sharedWallet.setAllowance(user1.address, initialAllowance);
      expect(await sharedWallet.allowances(user1.address)).to.equal(initialAllowance);

      await sharedWallet.setAllowance(user1.address, updatedAllowance);
      expect(await sharedWallet.allowances(user1.address)).to.equal(updatedAllowance);
    });

    it('Should allow owner to set allowances for multiple users', async function () {
      const allowance1 = ethers.utils.parseEther('1.0');
      const allowance2 = ethers.utils.parseEther('2.0');

      await sharedWallet.setAllowance(user1.address, allowance1);
      await sharedWallet.setAllowance(user2.address, allowance2);

      expect(await sharedWallet.allowances(user1.address)).to.equal(allowance1);
      expect(await sharedWallet.allowances(user2.address)).to.equal(allowance2);
    });

    it('Should prevent non-owners from setting allowances', async function () {
      const allowanceAmount = ethers.utils.parseEther('1.0');

      await expect(
        sharedWallet.connect(user1).setAllowance(user2.address, allowanceAmount),
      ).to.be.revertedWith('Not the owner');
    });

    it('Should allow owner to withdraw without allowance restrictions', async function () {
      const depositAmount = ethers.utils.parseEther('2.0');
      const withdrawAmount = ethers.utils.parseEther('1.5');

      // Deposit funds
      await owner.sendTransaction({
        to: sharedWallet.address,
        value: depositAmount,
      });

      const initialBalance = await user1.getBalance();

      // Owner withdraws without setting allowance
      await sharedWallet.withdraw(user1.address, withdrawAmount);

      const finalBalance = await user1.getBalance();
      expect(finalBalance.sub(initialBalance)).to.equal(withdrawAmount);
      expect(await sharedWallet.getBalance()).to.equal(depositAmount.sub(withdrawAmount));
    });
  });

  describe('Allowance System', function () {
    beforeEach(async function () {
      // Deposit some ETH for testing
      const depositAmount = ethers.utils.parseEther('5.0');
      await owner.sendTransaction({
        to: sharedWallet.address,
        value: depositAmount,
      });
    });

    it('Should allow users to withdraw within their allowance', async function () {
      const allowanceAmount = ethers.utils.parseEther('1.0');
      const withdrawAmount = ethers.utils.parseEther('0.5');

      await sharedWallet.setAllowance(user1.address, allowanceAmount);

      const initialBalance = await user2.getBalance();
      await sharedWallet.connect(user1).withdraw(user2.address, withdrawAmount);

      const finalBalance = await user2.getBalance();
      expect(finalBalance.sub(initialBalance)).to.equal(withdrawAmount);

      // Check allowance was reduced
      expect(await sharedWallet.allowances(user1.address)).to.equal(
        allowanceAmount.sub(withdrawAmount),
      );
    });

    it('Should prevent users from withdrawing more than their allowance', async function () {
      const allowanceAmount = ethers.utils.parseEther('1.0');
      const withdrawAmount = ethers.utils.parseEther('1.5');

      await sharedWallet.setAllowance(user1.address, allowanceAmount);

      await expect(
        sharedWallet.connect(user1).withdraw(user2.address, withdrawAmount),
      ).to.be.revertedWith('Insufficient allowance');
    });

    it('Should prevent users with zero allowance from withdrawing', async function () {
      const withdrawAmount = ethers.utils.parseEther('0.1');

      await expect(
        sharedWallet.connect(user1).withdraw(user2.address, withdrawAmount),
      ).to.be.revertedWith('Insufficient allowance');
    });

    it('Should handle exact allowance withdrawals', async function () {
      const allowanceAmount = ethers.utils.parseEther('1.0');

      await sharedWallet.setAllowance(user1.address, allowanceAmount);

      const initialBalance = await user2.getBalance();
      await sharedWallet.connect(user1).withdraw(user2.address, allowanceAmount);

      const finalBalance = await user2.getBalance();
      expect(finalBalance.sub(initialBalance)).to.equal(allowanceAmount);

      // Allowance should be zero after exact withdrawal
      expect(await sharedWallet.allowances(user1.address)).to.equal(0);
    });

    it('Should handle multiple partial withdrawals', async function () {
      const allowanceAmount = ethers.utils.parseEther('2.0');
      const withdraw1 = ethers.utils.parseEther('0.5');
      const withdraw2 = ethers.utils.parseEther('0.8');

      await sharedWallet.setAllowance(user1.address, allowanceAmount);

      // First withdrawal
      await sharedWallet.connect(user1).withdraw(user2.address, withdraw1);
      expect(await sharedWallet.allowances(user1.address)).to.equal(allowanceAmount.sub(withdraw1));

      // Second withdrawal
      await sharedWallet.connect(user1).withdraw(user2.address, withdraw2);
      expect(await sharedWallet.allowances(user1.address)).to.equal(
        allowanceAmount.sub(withdraw1).sub(withdraw2),
      );
    });
  });

  describe('Withdrawal Functionality', function () {
    beforeEach(async function () {
      // Deposit some ETH for testing
      const depositAmount = ethers.utils.parseEther('3.0');
      await owner.sendTransaction({
        to: sharedWallet.address,
        value: depositAmount,
      });
    });

    it('Should prevent withdrawals when contract has insufficient balance', async function () {
      const contractBalance = await sharedWallet.getBalance();
      const withdrawAmount = contractBalance.add(ethers.utils.parseEther('1.0'));

      await expect(sharedWallet.withdraw(user1.address, withdrawAmount)).to.be.revertedWith(
        'Insufficient balance',
      );
    });

    it('Should handle zero amount withdrawals', async function () {
      const allowanceAmount = ethers.utils.parseEther('1.0');
      await sharedWallet.setAllowance(user1.address, allowanceAmount);

      const initialBalance = await user2.getBalance();
      await sharedWallet.connect(user1).withdraw(user2.address, 0);

      const finalBalance = await user2.getBalance();
      expect(finalBalance).to.equal(initialBalance);

      // Allowance should remain unchanged
      expect(await sharedWallet.allowances(user1.address)).to.equal(allowanceAmount);
    });

    it('Should transfer funds to the correct recipient', async function () {
      const withdrawAmount = ethers.utils.parseEther('1.0');

      const initialBalance = await user3.getBalance();
      await sharedWallet.withdraw(user3.address, withdrawAmount);

      const finalBalance = await user3.getBalance();
      expect(finalBalance.sub(initialBalance)).to.equal(withdrawAmount);
    });

    it('Should update contract balance after withdrawal', async function () {
      const withdrawAmount = ethers.utils.parseEther('1.0');
      const initialContractBalance = await sharedWallet.getBalance();

      await sharedWallet.withdraw(user1.address, withdrawAmount);

      const finalContractBalance = await sharedWallet.getBalance();
      expect(finalContractBalance).to.equal(initialContractBalance.sub(withdrawAmount));
    });
  });

  describe('Edge Cases & Security', function () {
    beforeEach(async function () {
      // Deposit some ETH for testing
      const depositAmount = ethers.utils.parseEther('2.0');
      await owner.sendTransaction({
        to: sharedWallet.address,
        value: depositAmount,
      });
    });

    it('Should handle large allowance values', async function () {
      const largeAllowance = ethers.utils.parseEther('1000000');

      await sharedWallet.setAllowance(user1.address, largeAllowance);
      expect(await sharedWallet.allowances(user1.address)).to.equal(largeAllowance);
    });

    it('Should prevent allowance underflow', async function () {
      const allowanceAmount = ethers.utils.parseEther('1.0');
      const withdrawAmount = ethers.utils.parseEther('1.5');

      await sharedWallet.setAllowance(user1.address, allowanceAmount);

      await expect(
        sharedWallet.connect(user1).withdraw(user2.address, withdrawAmount),
      ).to.be.revertedWith('Insufficient allowance');
    });

    it('Should enforce access control consistently', async function () {
      // Test that only owner can set allowances
      await expect(
        sharedWallet.connect(user1).setAllowance(user2.address, ethers.utils.parseEther('1.0')),
      ).to.be.revertedWith('Not the owner');

      await expect(
        sharedWallet.connect(user2).setAllowance(user1.address, ethers.utils.parseEther('1.0')),
      ).to.be.revertedWith('Not the owner');
    });

    it('Should handle setting allowance to zero', async function () {
      const initialAllowance = ethers.utils.parseEther('1.0');

      await sharedWallet.setAllowance(user1.address, initialAllowance);
      expect(await sharedWallet.allowances(user1.address)).to.equal(initialAllowance);

      await sharedWallet.setAllowance(user1.address, 0);
      expect(await sharedWallet.allowances(user1.address)).to.equal(0);

      // User should not be able to withdraw with zero allowance
      await expect(
        sharedWallet.connect(user1).withdraw(user2.address, ethers.utils.parseEther('0.1')),
      ).to.be.revertedWith('Insufficient allowance');
    });
  });

  describe('Integration Tests', function () {
    it('Should handle complex multi-user scenario', async function () {
      // Deposit funds
      const depositAmount = ethers.utils.parseEther('10.0');
      await owner.sendTransaction({
        to: sharedWallet.address,
        value: depositAmount,
      });

      // Set different allowances for different users
      await sharedWallet.setAllowance(user1.address, ethers.utils.parseEther('3.0'));
      await sharedWallet.setAllowance(user2.address, ethers.utils.parseEther('2.0'));

      // User1 makes partial withdrawal
      const user1Withdraw1 = ethers.utils.parseEther('1.0');
      await sharedWallet.connect(user1).withdraw(user3.address, user1Withdraw1);
      expect(await sharedWallet.allowances(user1.address)).to.equal(ethers.utils.parseEther('2.0'));

      // User2 makes full allowance withdrawal
      const user2Withdraw = ethers.utils.parseEther('2.0');
      await sharedWallet.connect(user2).withdraw(user3.address, user2Withdraw);
      expect(await sharedWallet.allowances(user2.address)).to.equal(0);

      // Owner makes withdrawal without allowance restriction
      const ownerWithdraw = ethers.utils.parseEther('4.0');
      await sharedWallet.withdraw(user3.address, ownerWithdraw);

      // Verify final contract balance
      const expectedBalance = depositAmount
        .sub(user1Withdraw1)
        .sub(user2Withdraw)
        .sub(ownerWithdraw);
      expect(await sharedWallet.getBalance()).to.equal(expectedBalance);

      // User1 should still be able to withdraw remaining allowance
      const user1Withdraw2 = ethers.utils.parseEther('1.5');
      await sharedWallet.connect(user1).withdraw(user3.address, user1Withdraw2);
      expect(await sharedWallet.allowances(user1.address)).to.equal(ethers.utils.parseEther('0.5'));
    });

    it('Should handle allowance updates during active usage', async function () {
      // Deposit funds
      const depositAmount = ethers.utils.parseEther('5.0');
      await owner.sendTransaction({
        to: sharedWallet.address,
        value: depositAmount,
      });

      // Set initial allowance
      await sharedWallet.setAllowance(user1.address, ethers.utils.parseEther('1.0'));

      // User makes partial withdrawal
      await sharedWallet.connect(user1).withdraw(user2.address, ethers.utils.parseEther('0.5'));
      expect(await sharedWallet.allowances(user1.address)).to.equal(ethers.utils.parseEther('0.5'));

      // Owner increases allowance
      await sharedWallet.setAllowance(user1.address, ethers.utils.parseEther('2.0'));

      // User can now withdraw more
      await sharedWallet.connect(user1).withdraw(user2.address, ethers.utils.parseEther('1.5'));
      expect(await sharedWallet.allowances(user1.address)).to.equal(ethers.utils.parseEther('0.5'));

      // Owner decreases allowance
      await sharedWallet.setAllowance(user1.address, ethers.utils.parseEther('0.2'));

      // User cannot withdraw more than new allowance
      await expect(
        sharedWallet.connect(user1).withdraw(user2.address, ethers.utils.parseEther('0.3')),
      ).to.be.revertedWith('Insufficient allowance');
    });
  });

  describe('Balance Tracking', function () {
    it('Should accurately track balance through multiple operations', async function () {
      // Initial balance should be zero
      expect(await sharedWallet.getBalance()).to.equal(0);

      // Deposit 1
      const deposit1 = ethers.utils.parseEther('2.0');
      await owner.sendTransaction({
        to: sharedWallet.address,
        value: deposit1,
      });
      expect(await sharedWallet.getBalance()).to.equal(deposit1);

      // Deposit 2
      const deposit2 = ethers.utils.parseEther('1.5');
      await user1.sendTransaction({
        to: sharedWallet.address,
        value: deposit2,
      });
      expect(await sharedWallet.getBalance()).to.equal(deposit1.add(deposit2));

      // Withdrawal
      const withdrawal = ethers.utils.parseEther('1.0');
      await sharedWallet.withdraw(user2.address, withdrawal);
      expect(await sharedWallet.getBalance()).to.equal(deposit1.add(deposit2).sub(withdrawal));

      // Final balance check
      const expectedFinalBalance = ethers.utils.parseEther('2.5');
      expect(await sharedWallet.getBalance()).to.equal(expectedFinalBalance);
    });
  });
});
