// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract nUSDStablecoin {
    string public constant name = "nUSD StableCoin";
    string public constant symbol = "nUSD";
    uint8 public constant decimals = 18;
    
    AggregatorV3Interface internal priceFeed; // Chainlink Price Feed
    
    mapping(address => uint256) private balances;
    uint256 public totalSupply;

    event Deposit(address indexed depositor, uint256 ethAmount, uint256 nusdAmount);
    event Redeem(address indexed redeemer, uint256 nusdAmount, uint256 ethAmount);
    
    constructor(address _priceFeedAddress) {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }
    
    function deposit() external payable {
        require(msg.value > 0, "No ETH deposited");
        
        uint256 ethToUsd = getEthToUsd();
        uint256 nusdAmount = (msg.value * ethToUsd)/2;
        
        totalSupply += nusdAmount;
        balances[msg.sender] += nusdAmount;
        
        emit Deposit(msg.sender, msg.value, nusdAmount);
    }
    
    function redeem(uint256 nusdAmount) external {
        require(nusdAmount > 0, "Invalid nUSD amount");
        require(balances[msg.sender] >= nusdAmount, "Insufficient nUSD balance");
        
        uint256 ethToUsd = getEthToUsd();
        uint256 ethAmount = nusdAmount * 2 / ethToUsd;
        
        balances[msg.sender] -= nusdAmount;
        totalSupply -= nusdAmount;
        
        payable(msg.sender).transfer(ethAmount);
        
        emit Redeem(msg.sender, nusdAmount, ethAmount);
    }
    
    function getEthToUsd() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint8 decimals = priceFeed.decimals();
        uint256 priceWithoutDecimals = uint256(price) / (10**uint256(decimals));
        require(price > 0, "Invalid price");
        return priceWithoutDecimals;
    }
    
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}