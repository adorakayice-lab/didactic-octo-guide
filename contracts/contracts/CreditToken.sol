// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreditToken
 * @dev ERC-20 token representing tokenized credit/loans
 */
contract CreditToken is ERC20, Ownable {
    struct DealInfo {
        string dealName;
        uint256 apy;
        uint256 termMonths;
        uint256 maturityDate;
        bool isActive;
    }
    
    DealInfo public dealInfo;
    uint256 public totalYieldDistributed;
    
    mapping(address => uint256) public yieldAccrued;
    mapping(address => bool) public authorized;
    
    event YieldDistributed(address indexed to, uint256 amount);
    event DealMatured(string dealName, uint256 totalYield);
    
    constructor(
        string memory dealName,
        uint256 apy,
        uint256 termMonths,
        uint256 initialSupply
    ) ERC20("AssetBridge Credit Token", "ABC") {
        dealInfo = DealInfo({
            dealName: dealName,
            apy: apy,
            termMonths: termMonths,
            maturityDate: block.timestamp + (termMonths * 30 days),
            isActive: true
        });
        
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
    
    /**
     * @dev Distribute yield to token holders
     * @param recipient Recipient address
     * @param amount Yield amount
     */
    function distributeYield(address recipient, uint256 amount) external onlyOwner {
        require(dealInfo.isActive, "Deal is not active");
        require(amount > 0, "Yield amount must be greater than 0");
        
        yieldAccrued[recipient] += amount;
        totalYieldDistributed += amount;
        
        emit YieldDistributed(recipient, amount);
    }
    
    /**
     * @dev Get accrued yield for address
     * @param account Account address
     */
    function getYieldAccrued(address account) external view returns (uint256) {
        return yieldAccrued[account];
    }
    
    /**
     * @dev Mark deal as matured
     */
    function matureDeal() external onlyOwner {
        require(block.timestamp >= dealInfo.maturityDate, "Deal not yet matured");
        dealInfo.isActive = false;
        
        emit DealMatured(dealInfo.dealName, totalYieldDistributed);
    }
    
    /**
     * @dev Get deal information
     */
    function getDealInfo() external view returns (DealInfo memory) {
        return dealInfo;
    }
    
    /**
     * @dev Get days until maturity
     */
    function getDaysToMaturity() external view returns (uint256) {
        if (block.timestamp >= dealInfo.maturityDate) {
            return 0;
        }
        return (dealInfo.maturityDate - block.timestamp) / 1 days;
    }
}
