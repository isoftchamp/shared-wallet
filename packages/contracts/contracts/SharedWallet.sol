// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SharedWallet {
  address public owner;

  mapping(address => uint256) public allowances;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
  }

  modifier allowedToUse(uint256 _amount) {
    require(msg.sender == owner || allowances[msg.sender] >= _amount, "Insufficient allowance");
    _;
  }

  receive() external payable {}

  fallback() external payable {}

  function setAllowance(address _user, uint256 _amount) external onlyOwner {
    allowances[_user] = _amount;
  }

  function reduceAllowance(address _user, uint256 _amount) internal allowedToUse(_amount) {
    allowances[_user] -= _amount;
  }

  function withdraw(address payable _to, uint256 _amount) external allowedToUse(_amount) {
    require(address(this).balance >= _amount, "Insufficient balance");

    if (msg.sender != owner) {
      reduceAllowance(msg.sender, _amount);
    }

    _to.transfer(_amount);
  }

  function getBalance() external view returns (uint256) {
    return address(this).balance;
  }
}
