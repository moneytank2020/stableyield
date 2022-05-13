/**
 *Submitted for verification at FtmScan.com on 2022-04-22
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "hardhat/console.sol";

contract ApexPredator is Context, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for ERC20Burnable;

    uint256 private PREY_TO_FEED_FOR_1PREDATOR = 1080000;//for final version should be seconds in a day
    address public token_address = 0x065d934Ca7350676C70df4be1c83515D275C11ee;
    uint256 private PSN = 10000;
    uint256 private PSNH = 5000;
    uint256 private burnFeeVal = 5;
    uint256 private daoFeeVal = 3;
    //uint256 private webFeeVal = 2;
    //uint256 private teamFeeVal = 2;
    bool private initialized = false;
    address private BURN_ADDRESS = 0x0000000000000000000000000000000000000001;
    address private daoAddress = 0xC26Eb4ee385C54d479aA376212F0985aA36B5D85;
    //address payable private teamAdd;
    //address payable private webAdd;
    mapping (address => uint256) private predators;
    mapping (address => uint256) private claimedPrey;
    mapping (address => uint256) private lastHarvest;
    mapping (address => address) private referrals;
    uint256 private marketPreys;
    ERC20Burnable public token = ERC20Burnable(token_address);
    
    constructor() { 
        //teamAdd = payable(_team);
        //webAdd = payable(_web);
    }
    
    function harvestPreys(address ref) public {
        require(initialized);
        
        if(ref == msg.sender) {
            ref = address(BURN_ADDRESS);
        }
        
        if(referrals[msg.sender] == address(0) && referrals[msg.sender] != msg.sender) {
            referrals[msg.sender] = ref;
        }
        
        uint256 preysHarvested = getMyPrey(msg.sender);
        uint256 newMiners = SafeMath.div(preysHarvested,PREY_TO_FEED_FOR_1PREDATOR);
        predators[msg.sender] = SafeMath.add(predators[msg.sender],newMiners);
        claimedPrey[msg.sender] = 0;
        lastHarvest[msg.sender] = block.timestamp;
        
        //send referral preys
        claimedPrey[referrals[msg.sender]] = SafeMath.add(claimedPrey[referrals[msg.sender]],SafeMath.div(preysHarvested,8));
        
        //boost market to nerf miners hoarding
        marketPreys=SafeMath.add(marketPreys,SafeMath.div(preysHarvested,5));
    }
    
    function eatPrey() public {
        require(initialized);
        uint256 hasPrey = getMyPrey(msg.sender);
        uint256 preyValue = calculatePreyHarvest(hasPrey);
        uint256 fee1 = burnFee(preyValue);
        uint256 fee2 = daoFee(preyValue);
        claimedPrey[msg.sender] = 0;
        lastHarvest[msg.sender] = block.timestamp;
        marketPreys = SafeMath.add(marketPreys,hasPrey);
        token.burn(fee1);
        token.transfer(daoAddress,fee2);
        console.log("balance of contract:",token.balanceOf(address(this)));
        console.log("valueToSend:",SafeMath.sub(preyValue,fee1));
        console.log("this address:",address(this));
        token.safeTransfer(msg.sender, SafeMath.sub(preyValue,fee1));

    }
    
    function preyRewards(address adr) public view returns(uint256) {
        uint256 hasPrey = getMyPrey(adr);
        uint256 preyValue = calculatePreyHarvest(hasPrey);
        return preyValue;
    }
    
    function huntPrey(uint256 amount, address ref) public {
        require(initialized);
        token.safeTransferFrom(msg.sender, address(this), amount);
        console.log("amount:",amount);
        uint256 preyBought = calculatePreyHunt(amount,SafeMath.sub(token.balanceOf(address(this)),amount));
        preyBought = SafeMath.sub(preyBought,burnFee(preyBought));
        preyBought = SafeMath.sub(preyBought,daoFee(preyBought));

        uint256 fee1 = burnFee(amount);
        uint256 fee2 = daoFee(amount);
        token.transfer(BURN_ADDRESS, fee1);
        token.transfer(daoAddress,fee2);
        claimedPrey[msg.sender] = SafeMath.add(claimedPrey[msg.sender],preyBought);
        harvestPreys(ref);
    }
    
    function calculateTrade(uint256 rt,uint256 rs, uint256 bs) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(PSN,bs),SafeMath.add(PSNH,SafeMath.div(SafeMath.add(SafeMath.mul(PSN,rs),SafeMath.mul(PSNH,rt)),rt)));
    }
    
    function calculatePreyHarvest(uint256 preys) public view returns(uint256) {
        return calculateTrade(preys,marketPreys,IERC20(token_address).balanceOf(address(this)));
    }
    
    function calculatePreyHunt(uint256 eth,uint256 contractBalance) public view returns(uint256) {
        return calculateTrade(eth,contractBalance,marketPreys);
    }
    
    function calculatePreyHuntSimple(uint256 eth) public view returns(uint256) {
        return calculatePreyHunt(eth,IERC20(token_address).balanceOf(address(this)));
    }
    
    function burnFee(uint256 amount) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(amount,burnFeeVal),100);
    }

    function daoFee(uint256 amount) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(amount,daoFeeVal),100);
    }
    
    function openHunt() public payable onlyOwner {
        require(marketPreys == 0);
        initialized = true;
        marketPreys = 108000000000;
    }
    
    function getBalance() public view returns(uint256) {
        return token.balanceOf(address(this));
    }
    
    function getMyMiners(address adr) public view returns(uint256) {
        return predators[adr];
    }
    
    function getMyPrey(address adr) public view returns(uint256) {
        return SafeMath.add(claimedPrey[adr],getPreysSinceLastHarvest(adr));
    }
    
    function getPreysSinceLastHarvest(address adr) public view returns(uint256) {
        uint256 secondsPassed=min(PREY_TO_FEED_FOR_1PREDATOR,SafeMath.sub(block.timestamp,lastHarvest[adr]));
        return SafeMath.mul(secondsPassed,predators[adr]);
    }
     function WithdrawEth() onlyOwner() public {
    require (token.balanceOf(address(this)) > 0, "Can't withdraw negative or zero");
    token.transferFrom(_msgSender(),address(this),token.balanceOf(address(this)));
  }
    
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}