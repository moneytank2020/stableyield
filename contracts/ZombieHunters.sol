/**
 *Submitted for verification at FtmScan.com on 2022-04-22
*/

// SPDX-License-Identifier: MIT
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}

pragma solidity 0.8.9;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context { 
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

contract Ownable is Context {
    address private _owner;
    address public _marketing;
    //address public _team;
    //address public _web;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
    * @dev Initializes the contract setting the deployer as the initial owner.
    */
    constructor () {
      address msgSender = _msgSender();
      _owner = msgSender;
      emit OwnershipTransferred(address(0), msgSender);
      _marketing = 0xC010bEAb5C3BE2d4811F35609D5B29441aCeAB23;
      /**_team = 0xe9033c5F4564553e7efcC7B8D81B2D80B67DC9C3;
      _web = 0x06aFaa4595e38587Ad2a336023F54C3b72551e0f; */
    } 

    /**
    * @dev Returns the address of the current owner.
    */
    function owner() public view returns (address) {
      return _owner;
    }

    
    modifier onlyOwner() {
      require(_owner == _msgSender(), "Ownable: caller is not the owner");
      _;
    }

    function renounceOwnership() public onlyOwner {
      emit OwnershipTransferred(_owner, address(0));
      _owner = address(0);
    }

    function transferOwnership(address newOwner) public onlyOwner {
      _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal {
      require(newOwner != address(0), "Ownable: new owner is the zero address");
      emit OwnershipTransferred(_owner, newOwner);
      _owner = newOwner;
    }
}

import "hardhat/console.sol";

contract Zombiehunter is Context, Ownable {
    using SafeMath for uint256;

    uint256 private ZOMBIES_TO_HATCH_1MINERS = 1080000;//for final version should be seconds in a day
    uint256 private PSN = 10000;
    uint256 private PSNH = 5000;
    uint256 private devFeeVal = 5;
    uint256 private marketingFeeVal = 3;
    //uint256 private webFeeVal = 2;
    //uint256 private teamFeeVal = 2;
    bool private initialized = false;
    address payable private recAdd;
    address payable private marketingAdd;
    //address payable private teamAdd;
    //address payable private webAdd;
    mapping (address => uint256) private zombieMiners;
    mapping (address => uint256) private claimedZombie;
    mapping (address => uint256) private lastHarvest;
    mapping (address => address) private referrals;
    uint256 private marketZombies;
    
    constructor() { 
        recAdd = payable(msg.sender);
        marketingAdd = payable(_marketing);
        //teamAdd = payable(_team);
        //webAdd = payable(_web);
    }
    
    function harvestZombies(address ref) public {
        require(initialized);
        
        if(ref == msg.sender) {
            ref = address(0xC010bEAb5C3BE2d4811F35609D5B29441aCeAB23);
        }
        
        if(referrals[msg.sender] == address(0) && referrals[msg.sender] != msg.sender) {
            referrals[msg.sender] = ref;
        }
        
        uint256 zombiesUsed = getMyZombies(msg.sender);
        uint256 newMiners = SafeMath.div(zombiesUsed,ZOMBIES_TO_HATCH_1MINERS);
        zombieMiners[msg.sender] = SafeMath.add(zombieMiners[msg.sender],newMiners);
        claimedZombie[msg.sender] = 0;
        lastHarvest[msg.sender] = block.timestamp;
        
        //send referral zombies
        claimedZombie[referrals[msg.sender]] = SafeMath.add(claimedZombie[referrals[msg.sender]],SafeMath.div(zombiesUsed,8));
        
        //boost market to nerf miners hoarding
        marketZombies=SafeMath.add(marketZombies,SafeMath.div(zombiesUsed,5));
    }
    
    function sellZombies() public {
        require(initialized);
        uint256 hasZombies = getMyZombies(msg.sender);
        uint256 zombieValue = calculateZombieSell(hasZombies);
        uint256 fee1 = devFee(zombieValue);
        uint256 fee2 = marketingFee(zombieValue);
        //uint256 fee3 = webFee(zombieValue);
        //uint256 fee4 = teamFee(zombieValue);
        claimedZombie[msg.sender] = 0;
        lastHarvest[msg.sender] = block.timestamp;
        marketZombies = SafeMath.add(marketZombies,hasZombies);
        console.log("recBefore1:",recAdd.balance);
        recAdd.transfer(fee1);
        marketingAdd.transfer(fee2);        
        //teamAdd.transfer(fee3);
        //webAdd.transfer(fee4);
        console.log("recBefore:",recAdd.balance);
        payable (msg.sender).transfer(SafeMath.sub(zombieValue,fee1));
        console.log("recAdd:",recAdd.balance);
    }
    
    function zombieRewards(address adr) public view returns(uint256) {
        uint256 hasZombies = getMyZombies(adr);
        uint256 zombieValue = calculateZombieSell(hasZombies);
        return zombieValue;
    }
    
    function huntZombies(address ref) public payable {
        require(initialized);
        console.log("test:",address(this).balance);
        uint256 zombiesBought = calculateZombieHunt(msg.value,SafeMath.sub(address(this).balance,msg.value));
        zombiesBought = SafeMath.sub(zombiesBought,devFee(zombiesBought));
        zombiesBought = SafeMath.sub(zombiesBought,marketingFee(zombiesBought));
        //zombiesBought = SafeMath.sub(zombiesBought,webFee(zombiesBought));
        //zombiesBought = SafeMath.sub(zombiesBought,teamFee(zombiesBought));

        uint256 fee1 = devFee(msg.value);
        uint256 fee2 = marketingFee(msg.value);
        //uint256 fee3 = webFee(msg.value);
        //uint256 fee4 = teamFee(msg.value);
        console.log("fee1:",fee1);
        console.log("recAddAddress:",recAdd);
        console.log("recAdd1:",recAdd.balance);
        recAdd.transfer(fee1);
        console.log("recAdd2:",recAdd.balance);
        marketingAdd.transfer(fee2);
        //teamAdd.transfer(fee3);
        //webAdd.transfer(fee4);

        claimedZombie[msg.sender] = SafeMath.add(claimedZombie[msg.sender],zombiesBought);
        harvestZombies(ref);
    }
    
    function calculateTrade(uint256 rt,uint256 rs, uint256 bs) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(PSN,bs),SafeMath.add(PSNH,SafeMath.div(SafeMath.add(SafeMath.mul(PSN,rs),SafeMath.mul(PSNH,rt)),rt)));
    }
    
    function calculateZombieSell(uint256 zombies) public view returns(uint256) {
        return calculateTrade(zombies,marketZombies,address(this).balance);
    }
    
    function calculateZombieHunt(uint256 eth,uint256 contractBalance) public view returns(uint256) {
        return calculateTrade(eth,contractBalance,marketZombies);
    }
    
    function calculateZombieHuntSimple(uint256 eth) public view returns(uint256) {
        return calculateZombieHunt(eth,address(this).balance);
    }
    
    function devFee(uint256 amount) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(amount,devFeeVal),100);
    }

    function marketingFee(uint256 amount) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(amount,marketingFeeVal),100);
    }
    
     /**function webFee(uint256 amount) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(amount,webFeeVal),100);
    }

    function teamFee(uint256 amount) private view returns(uint256) {
        return SafeMath.div(SafeMath.mul(amount,teamFeeVal),100);
    } */

    function openHunt() public payable onlyOwner {
        require(marketZombies == 0);
        initialized = true;
        marketZombies = 108000000000;
    }
    
    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }
    
    function getMyMiners(address adr) public view returns(uint256) {
        return zombieMiners[adr];
    }
    
    function getMyZombies(address adr) public view returns(uint256) {
        return SafeMath.add(claimedZombie[adr],getZombiesSinceLastHarvest(adr));
    }
    
    function getZombiesSinceLastHarvest(address adr) public view returns(uint256) {
        uint256 secondsPassed=min(ZOMBIES_TO_HATCH_1MINERS,SafeMath.sub(block.timestamp,lastHarvest[adr]));
        return SafeMath.mul(secondsPassed,zombieMiners[adr]);
    }
     function WithdrawEth() onlyOwner() public {
    require (address(this).balance > 0, "Can't withdraw negative or zero");
    payable(_msgSender()).transfer(address(this).balance);
  }
    
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}