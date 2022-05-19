// SPDX-License-Identifier: MIT

/*
 ________  _________  ________  ________  ___       _______            ___    ___ ___  _______   ___       ________     
|\   ____\|\___   ___\\   __  \|\   __  \|\  \     |\  ___ \          |\  \  /  /|\  \|\  ___ \ |\  \     |\   ___ \    
\ \  \___|\|___ \  \_\ \  \|\  \ \  \|\ /\ \  \    \ \   __/|         \ \  \/  / | \  \ \   __/|\ \  \    \ \  \_|\ \   
 \ \_____  \   \ \  \ \ \   __  \ \   __  \ \  \    \ \  \_|/__        \ \    / / \ \  \ \  \_|/_\ \  \    \ \  \ \\ \  
  \|____|\  \   \ \  \ \ \  \ \  \ \  \|\  \ \  \____\ \  \_|\ \        \/  /  /   \ \  \ \  \_|\ \ \  \____\ \  \_\\ \ 
    ____\_\  \   \ \__\ \ \__\ \__\ \_______\ \_______\ \_______\     __/  / /      \ \__\ \_______\ \_______\ \_______\
   |\_________\   \|__|  \|__|\|__|\|_______|\|_______|\|_______|    |\___/ /        \|__|\|_______|\|_______|\|_______|
   \|_________|                                                      \|___|/                                            
                                                                                                                        
                                                                                                                                
BStable Yield - BSC BUSD Bond
*/


import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IBEP20.sol";

pragma solidity ^0.8.9;

contract StableYield is Context, Ownable {
    using SafeMath for uint256;

    uint256 public TOKENS_TO_GENERATE_1BOND = 2468571;//for final version should be seconds in a day
    address public token_address = 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d;
    uint256 private PSN = 10000;
    uint256 private PSNH = 5000;
    uint256 public devFeeVal = 3;
    bool private initialized = false;
    address private recAdd = 0xfd92625d8CA47d8c225b9d3350df72B2AeF988D9;
    mapping (address => uint256) private bankerBonds;
    mapping (address => uint256) private claimedTokens;
    mapping (address => uint256) private lastBondIssue;
    mapping (address => address) private referrals;
    uint256 private marketTokens;
    IBEP20 public token = IBEP20(token_address);
    
    constructor() {
        // recAdd = payable(msg.sender);
    }
    
    function generateTokens(address ref) public {
        require(initialized);
        
        if(ref == msg.sender) {
            ref = address(0);
        }
        
        if(referrals[msg.sender] == address(0) && referrals[msg.sender] != msg.sender) {
            referrals[msg.sender] = ref;
        }
        
        uint256 tokensUsed = getMyTokens(msg.sender);
        uint256 newBonds = SafeMath.div(tokensUsed,TOKENS_TO_GENERATE_1BOND);
        bankerBonds[msg.sender] = SafeMath.add(bankerBonds[msg.sender],newBonds);
        claimedTokens[msg.sender] = 0;
        lastBondIssue[msg.sender] = block.timestamp;
        
        //send referral Tokens
        claimedTokens[referrals[msg.sender]] = SafeMath.add(claimedTokens[referrals[msg.sender]],SafeMath.div(tokensUsed,8));
        //boost market to nerf miners hoarding
        marketTokens=SafeMath.add(marketTokens,SafeMath.div(tokensUsed,5));
    }
    
    function sellTokens() public {
        require(initialized);
        uint256 hasTokens = getMyTokens(msg.sender);
        uint256 tokenValue = calculateTokenSell(hasTokens);
        uint256 fee = devFee(tokenValue);
        claimedTokens[msg.sender] = 0;
        lastBondIssue[msg.sender] = block.timestamp;
        marketTokens = SafeMath.add(marketTokens,hasTokens);
        token.transfer(recAdd,fee);
        token.transfer(msg.sender, SafeMath.sub(tokenValue,fee));
    }
    
    function tokenRewards(address adr) public view returns(uint256) {
        uint256 hasTokens = getMyTokens(adr);
        uint256 tokenValue = calculateTokenSell(hasTokens);
        return tokenValue;
    }
    
    function buyTokens(uint256 amount, address ref) public {
        require(initialized);
        token.transferFrom(msg.sender, address(this), amount);
        uint256 tokensBought = calculateTokenBuy(amount,SafeMath.sub(token.balanceOf(address(this)),amount));
        tokensBought = SafeMath.sub(tokensBought,devFee(tokensBought));
        uint256 fee = devFee(amount);
        token.transfer(recAdd,fee);
        claimedTokens[msg.sender] = SafeMath.add(claimedTokens[msg.sender],tokensBought);
        generateTokens(ref);
    }

    
    function calculateTrade(uint256 rt,uint256 rs, uint256 bs) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(PSN,bs),SafeMath.add(PSNH,SafeMath.div(SafeMath.add(SafeMath.mul(PSN,rs),SafeMath.mul(PSNH,rt)),rt)));
    }

    function calculateTokenSell(uint256 tokens) public view returns(uint256) {
        return calculateTrade(tokens,marketTokens,getBalance());
    }
    
    function calculateSellPriceMinusFee() public view returns(uint256){
        uint256 userTokens = getMyTokens(msg.sender);
        uint256 tokenValue = calculateTokenSell(userTokens);
        uint256 fee = devFee(tokenValue);
        return SafeMath.sub(tokenValue,fee);
    }

    function calculateBuyMinusFee(uint256 amount) public view returns (uint256){
        uint256 potentialContractAmount = SafeMath.add(token.balanceOf(address(this)),amount);
        uint256 tokensBought = calculateTrade(amount,SafeMath.sub(potentialContractAmount,amount),marketTokens);
        tokensBought = SafeMath.sub(tokensBought,devFee(tokensBought));
        uint256 tokensUsed = SafeMath.add(tokensBought,getTokensSinceLastClaim(msg.sender));
        uint256 newBonds = SafeMath.div(tokensUsed,TOKENS_TO_GENERATE_1BOND);
        return newBonds;
    }

    function calculateTokenBuy(uint256 eth,uint256 contractBalance) public view returns(uint256) {
        return calculateTrade(eth,contractBalance,marketTokens);
    }
    
    function calculateTokenBuySimple(uint256 eth) public view returns(uint256) {
        return calculateTokenBuy(eth,getBalance());
    }
    
    function devFee(uint256 amount) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(amount,devFeeVal),100);
    }
    
    function provideMarket() public onlyOwner {
        require(marketTokens == 0);
        initialized = true;
        marketTokens = TOKENS_TO_GENERATE_1BOND*100000;
    }
    
    function getBalance() public view returns(uint256) {
        return token.balanceOf(address(this));
    }
    
    function getMyBonds(address adr) public view returns(uint256) {
        return bankerBonds[adr];
    }
    
    function getMyTokens(address adr) public view returns(uint256) {
        return SafeMath.add(claimedTokens[adr],getTokensSinceLastClaim(adr));
    }
    
    function getTokensSinceLastClaim(address adr) public view returns(uint256) {
        uint256 secondsPassed=min(TOKENS_TO_GENERATE_1BOND,SafeMath.sub(block.timestamp,lastBondIssue[adr]));
        return SafeMath.mul(secondsPassed,bankerBonds[adr]);
    }
    
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}