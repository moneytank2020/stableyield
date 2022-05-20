import { toContainElement } from '@testing-library/jest-dom/dist/matchers'
import { getAddress } from 'ethers/lib/utils'

// import { getRewardsPersecondAbi } from './RewardsPerSecondAbis'
const { ethers, BigNumber } = require('ethers')


const { getFullDisplayBalance, getDisplayBalance } = require('./util')
const constants = require("./constants.json")
const stableYieldAbi = require("../abi/stableyield.json")
const usdcAbi = require('../abi/usdcabi.json')
// const pools = require("./../api/pools.json")
// const ApexFtmLpTokenAddress = "0x78e7743bA9b517fe4737DAa64687900790793D26"
// const ApexTokenAddress = "0x065d934ca7350676c70df4be1c83515d275c11ee"
// const WFTTokenAddress = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83"
// const APEXTokenAdress = "0x065d934ca7350676c70df4be1c83515d275c11ee"
// const AshareRewardPoolAddress = "0xaC23F2627FFf0a29c41e4CBd8087f106CFa1b162"
// const AshareTopkenAddress = "0x1c9324d4c71602af7874a48d76d48f8a9e1b87bb"
// const ApexFtmGenesisRewardpoolAddress = "0xccf0adc83407e1857d9dbbcf753ed61893436b5e"
// const ApexFtmRewardPoolAddress = "0xc29b170eedfad89308f13990bb9b5186997ce475"
// const ashare = require('../abi/ashares.json')
// const vaultAbi = require('../abi/apexVaultAbi.json')
// const apexFtmAbi = require('../abi/apexFtmAbi.json')
// const apexAutoCompundApexFtmAbi = require('../abi/apexAutoCompoundApexFtm.json')
// const apexTokenAbi = require('../abi/apexTokenAbi.json')
// const wFtmAbi = require('../abi/wftmabi.json')
// const fUSDTokenAbi = require('../abi/usdtAbi.json')
// const asharesRewardPoolAbi = require('../abi/asharesRewardPoolAbi.json')
// const { Fetcher, Token, Route } = require('@spookyswap/sdk');
// const abis = require('./abis.json')


const getSigner = async(web3) =>{
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = await provider.getSigner();
    return signer
}


const getContract = async(web3) =>{
    const signer = await getSigner(web3)
    const stableYieldContract = await new ethers.Contract(constants.stableYieldContract,stableYieldAbi,signer)
    return stableYieldContract
}

const getUserAddress = async(web3) =>{
    const signer = await getSigner(web3)
    const address = await signer.getAddress()
    return address
}

const getTokenContact = async(web3) =>{
    const stableYieldContract = await getContract(web3)
    const tokenAddress = await stableYieldContract.token_address()
    const tokenContract = new ethers.Contract(tokenAddress, usdcAbi, await getSigner(web3));
    return tokenContract
}

const buyTokensForUser = async(web3, amount, referral) =>{
    let ref = referral
    
    if(!ethers.utils.isAddress(referral)){
        const address = await getUserAddress(web3)
        ref = address
    }
    const stableYieldContract = await getContract(web3)
    const tx = await stableYieldContract.buyTokens(ethers.utils.parseEther(amount), ref)
}

const sellTokensForUser = async(web3) => {
    const stableYieldContract = await getContract(web3)
    const tx = await stableYieldContract.sellTokens()
    await tx.wait()
}

const getTokenReward = async(web3) =>{
    const stableYieldContract = await getContract(web3)
    const address = await getUserAddress(web3)
    console.log("address:",address)
    const rewards2 = await stableYieldContract.getMyTokens(address)
    console.log("reward2:",rewards2)
    const rewards = await stableYieldContract.tokenRewards(address)
    console.log("reward:",rewards)
    return `${Number(ethers.utils.formatEther(rewards.toString())).toFixed(3)}`
}

const getUserTokenBalance = async(web3) =>{
    const token = await getTokenContact(web3)
    const signer = await getSigner(web3)
    const userAddress = await signer.getAddress();
    var balance = await token.balanceOf(userAddress)
    return Number(ethers.utils.formatEther(balance.toString())).toFixed(3)
}

const getUserTokensMinusFees = async(web3) => {
    const contract = await getContract(web3)
    const userContractTokenBalance = await contract.calculateSellPriceMinusFee()
    return ethers.utils.formatEther(userContractTokenBalance)
}

const getBondsForTokens = async(web3, amount) =>{
    const contract = await getContract(web3)
    const bondsForTokens = await contract.calculateBuyMinusFee(ethers.utils.parseEther(amount))
    return Number(bondsForTokens)
}

const getContractTokenBalance = async(web3) =>{
    const contract = await getContract(web3)
    var balance = await contract.getBalance()
    return Number(ethers.utils.formatEther(balance.toString())).toFixed(3)
}


const getApyAndRate = async(web3)=>{
    const stableYieldContract = await getContract(web3)
    var amount = await stableYieldContract.TOKENS_TO_GENERATE_1BOND()
    var rate = 86400/amount
    var apy = `${((rate*365)*100).toFixed()}%`
    var stringRate = `${(rate*100).toFixed(1)}%`
    return {apy,rate:stringRate}
}

const getFees = async(web3)=>{
    const stableYieldContract = await getContract(web3)
    var tax = await stableYieldContract.devFeeVal()
    var charFee = await stableYieldContract.charityFeeVal()
    var taxFeeVal = Number(tax)
    var charFeeVal = Number(charFee)
    return {taxFeeVal,charFeeVal}
}


const getUserBonds = async(web3)=>{
    const stableYieldContract = await getContract(web3)
    const signer = await getSigner(web3)
    const userAddress = await signer.getAddress();
    var bonds = await stableYieldContract.getMyBonds(userAddress)
    return `${bonds}`
}

const reInvestUserBonds = async(web3,referral) => {
    let ref = referral
    if(!ethers.utils.isAddress(referral)){
        const address = await getUserAddress(web3)
        ref = address
    }
    const stableYieldContract = await getContract(web3)
    await stableYieldContract.generateTokens(ref)
}

const approve = async(web3) =>{
    try {
        const token = await getTokenContact(web3)
        const tx = await token.approve(constants.stableYieldContract, ethers.constants.MaxInt256);
        const receipt = await tx.wait();
        if (receipt.status) {
            return true
        }
    } catch (error) {
        console.log("error:",error)
        throw error
    }
}

const hasApproved = async(web3)=>{
    const token = await getTokenContact(web3)
    const signer = await getSigner(web3)
    const userAddress = await signer.getAddress();
    const allowance = await token.allowance(userAddress, constants.stableYieldContract);
    const isAllowed = Number(allowance) !== 0
    return isAllowed
}

export{
    buyTokensForUser,
    reInvestUserBonds,
    approve,
    hasApproved,
    sellTokensForUser,
    getApyAndRate,
    getFees,
    getUserTokenBalance,
    getContractTokenBalance,
    getUserBonds,
    getBondsForTokens,
    getUserTokensMinusFees,
    getTokenReward
}

// const getRewardTokenBalance = async(web3) => {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const token = await new ethers.Contract(constants.Vault, vaultAbi, signer)
//     const balance = await token.balanceOf(signer.getAddress())
//     return ethers.utils.formatEther(balance)
// }

// const getLPBalanceOfVault= async(web3,pool) =>  {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const vault = await new ethers.Contract(pool.vaultAddress, abis.vaultAbi, signer)
//     const balance = await vault.balance()
//     return ethers.utils.formatEther(balance)
// }

// // const getLPBalanceOfVault= async(web3) =>  {
// //     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
// //     const signer = await provider.getSigner()
// //     const vault = await new ethers.Contract(constants.Vault, vaultAbi, signer)
// //     const balance = await vault.balance()
// //     return ethers.utils.formatEther(balance)
// // }

// const getLPBalance = async(web3,pool) =>  {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const address = await signer.getAddress()
//     const poolToken = await new ethers.Contract(pool.poolTokenPairAddress, abis.poolTokenPairAbi, signer)
//     const balance = await poolToken.balanceOf(address)
//     return Number(ethers.utils.formatEther(balance))
// }

// // const getLPBalance = async(web3) =>  {
// //     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
// //     const signer = await provider.getSigner()
// //     const address = await signer.getAddress()
// //     const apexFTMToken = await new ethers.Contract(ApexFtmLpTokenAddress, apexFtmAbi, signer)
// //     const balance = await apexFTMToken.balanceOf(address)
// //     return Number(ethers.utils.formatEther(balance))
// // }



// const hasAgreedToTerms = async(address, web3) =>  {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const vault = await new ethers.Contract(constants.Vault, vaultAbi, signer)
//     const hasReadAndAcceptedTerms = await vault.hasReadAndAcceptedTerms(address)
//     return hasReadAndAcceptedTerms
// }

// const agreeToTerms = async(web3)=>{
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const vault = await new ethers.Contract(constants.Vault, vaultAbi, signer)
//     await vault.agreeToTerms()
// }

// const getAmountDeposited = async(web3)=>{
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const vault = await new ethers.Contract(constants.Vault, vaultAbi, signer)
//     const DepositedAmount = await vault.cumulativeDeposits(signer.getAddress())
//     const WithdrawalAmount = await vault.cumulativeWithdrawals(signer.getAddress())
//     const depositedAmount = ethers.utils.formatEther(DepositedAmount)
//     const withdrawalAmount = ethers.utils.formatEther(WithdrawalAmount)
//     const finalAmount = depositedAmount - withdrawalAmount
//     return finalAmount
// }

// const depositIntoVault = async(amount, web3, pool)=> {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const userAddress = await signer.getAddress();
//     const vault = await new ethers.Contract(pool.vaultAddress, abis.vaultAbi, signer)
//     const tokenAddress = await vault.token()
//     const token = await new ethers.Contract(tokenAddress, abis.poolTokenPairAbi, signer)
//     const allowance = await token.allowance(userAddress, pool.vaultAddress);
//     if (!allowance) {
//         const tx = await token.approve(pool.vaultAddress, ethers.constants.MaxInt256)
//         const receipt = await tx.wait();
//     }
//     const depositedAmount = ethers.utils.parseEther(amount)
//     var tx = await vault.deposit(depositedAmount)
//     tx.wait()
// }

// const withdrawFromVault =  async (amount, web3) => {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const userAddress = await signer.getAddress();
//     const vault = await new ethers.Contract(constants.Vault, vaultAbi, signer)
//     const withdrawAmount = ethers.utils.parseEther(amount)
//     const tx = await vault.withdraw(withdrawAmount)
//     tx.wait()
// }


// const withdrawalUsingTokenPairValue = async (amount, web3, pool) => {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const userAddress = await signer.getAddress();
//     const vault = await new ethers.Contract(pool.vaultAddress, abis.vaultAbi, signer)
//     const PricePerShare = await vault.getPricePerFullShare()
//     const pricePerShare = ethers.utils.formatEther(PricePerShare)
//     const calculation = amount / pricePerShare
//     const finalWithdrawlBanace = ethers.utils.parseEther(calculation.toString())
//     const tx = await vault.withdraw(finalWithdrawlBanace)
//     tx.wait()
// }

// // const withdrawalUsingApexFTMValue = async (amount, web3, pool) => {
// //     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
// //     const signer = await provider.getSigner()
// //     const userAddress = await signer.getAddress();
// //     const vault = await new ethers.Contract(pool.vaultAddress, pool.vaultAbi, signer)
// //     const PricePerShare = await vault.getPricePerFullShare()
// //     const pricePerShare = ethers.utils.formatEther(PricePerShare)
// //     const calculation = amount / pricePerShare
// //     const finalWithdrawlBanace = ethers.utils.parseEther(calculation.toString())
// //     const tx = await vault.withdraw(finalWithdrawlBanace)
// //     tx.wait()
// // }

// const pricePerShare = async(web3) => {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const userAddress = await signer.getAddress();
//     const vault = await new ethers.Contract(constants.Vault, vaultAbi, signer)
//     const PricePerShare = await vault.getPricePerFullShare()
//     const pricePerShare = ethers.utils.parseEther(PricePerShare)
//     return pricePerShare
// }

// const totalEarnedByUser = async(web3, pool)=> {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const userAddress = await signer.getAddress();
//     const vault = await new ethers.Contract(pool.vaultAddress, vaultAbi, signer)
//     const Balance = await vault.balanceOf(userAddress)
//     const balance = ethers.utils.formatEther(Balance)
//     const PricePerShare = await vault.getPricePerFullShare()
//     const pricePerShare = ethers.utils.formatEther(PricePerShare)
//     const amountOfTokensUserOwns = balance * pricePerShare
//     return amountOfTokensUserOwns
// }

// const hasApproved = async(web3, pool)=>{
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = await provider.getSigner()
//     const userAddress = await signer.getAddress();
//     const vault = await new ethers.Contract(pool.vaultAddress, abis.vaultAbi, signer)
//     const tokenAddress = await vault.token()
//     const token = await new ethers.Contract(tokenAddress, abis.poolTokenPairAbi, signer)
//     const allowance = await token.allowance(userAddress, pool.vaultAddress);
//     const isAllowed = Number(allowance) !== 0
//     return isAllowed
// }

// const approve = async(web3,pool) =>{
//     try {
//         const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//         const signer = provider.getSigner();
//         const userAddress = await signer.getAddress();
//         const vault = await new ethers.Contract(pool.vaultAddress, abis.vaultAbi, signer)
//         const tokenAddress = await vault.token()
//         const token = new ethers.Contract(tokenAddress, abis.poolTokenPairAbi, signer);
//         const tx = await token.approve(pool.vaultAddress, ethers.constants.MaxInt256);
//         const receipt = await tx.wait();
//         if (receipt.status) {
//             return true
//         }
//     } catch (error) {
//         throw error
//     }
// }

// const harvest = async (web3) => {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = provider.getSigner();
//     const userAddress = await signer.getAddress();
//     const strategy = await new ethers.Contract(constants.Strategy, apexAutoCompundApexFtmAbi, signer)
//     await strategy.harvest()
// }

// const getDepositTokenPriceInDollars = async(web3,pool) => {
//     return await GetDepositTokenPriceInDollars(web3,pool);
// }

// const getPoolAprTVL = async(web3,pool) => {
//     const rateOfCompoundYearly = 17520
//     const rateOfCompoundDaily = 48
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = provider.getSigner();
//     const tokenPerSecond = await getTokenPerSecond(signer,pool)
//     const stat = await getRewardTokenStat(signer,pool)
//     const poolTokenPair = await new ethers.Contract(pool.poolTokenPairAddress, abis.poolTokenPairAbi, signer)
//     const stakeInPool = await poolTokenPair.balanceOf(pool.tokenPerSecondPoolAddress);
//     const depositTokenPrice = await GetDepositTokenPriceInDollars(web3,pool);
//     const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, 18));
//     const tokenPerHour = tokenPerSecond.mul(60).mul(60);
//     const totalRewardPricePerYear =
//         Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
//     const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
//     const totalStakingTokenInPool =
//         Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, 18));
//     const DailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
//     const YearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;

//     const YearlyApy = (Math.pow((1 + ((YearlyAPR / 100) / rateOfCompoundYearly)), rateOfCompoundYearly) - 1) * 100
//     const DailyApy = (Math.pow((1 + ((DailyAPR / 100) / rateOfCompoundDaily)), rateOfCompoundDaily) - 1) * 100
//     return {
//         dailyAPY: DailyApy.toFixed(2).toString(),
//         yearlyAPY: YearlyApy.toFixed(2).toString(),
//         TVL: TVL.toFixed(2).toString(),
//     };
// }

// // const getPoolAprTVL = async(web3) => {
// //     var pool = pools["0"]
// //     const rateOfCompoundYearly = 17520
// //     const rateOfCompoundDaily = 48
// //     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
// //     const signer = provider.getSigner();
// //     const tokenPerSecond = await getTokenPerSecond(signer)
// //     const stat = await getAShareStat(signer)
// //     const ApexFtmLpToken = await new ethers.Contract(ApexFtmLpTokenAddress, apexFtmAbi, signer)
// //     const stakeInPool = await ApexFtmLpToken.balanceOf(AshareRewardPoolAddress);
// //     const depositTokenPrice = await GetDepositTokenPriceInDollars(web3);
// //     const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, 18));
// //     const tokenPerHour = tokenPerSecond.mul(60).mul(60);
// //     const totalRewardPricePerYear =
// //         Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
// //     const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
// //     const totalStakingTokenInPool =
// //         Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, 18));
// //     const DailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
// //     const YearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
// //     const YearlyApy = (Math.pow((1 + ((YearlyAPR / 100) / rateOfCompoundYearly)), rateOfCompoundYearly) - 1) * 100
// //     const DailyApy = (Math.pow((1 + ((DailyAPR / 100) / rateOfCompoundDaily)), rateOfCompoundDaily) - 1) * 100

// //     return {
// //         dailyAPY: DailyApy.toFixed(2).toString(),
// //         yearlyAPY: YearlyApy.toFixed(2).toString(),
// //         TVL: TVL.toFixed(2).toString(),
// //     };
// // }

// const getFees = async(web3,pool) =>{
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = provider.getSigner();
//     const userAddress = await signer.getAddress();
//     const strategy = await new ethers.Contract(pool.strategyAddress, abis.strategyAbi, signer)
//     const callFee = await strategy.callFee()
//     const securityFee = await strategy.securityFee()
//     const totalFee = await strategy.totalFee()
//     const PERCENT_DIVISOR = await strategy.PERCENT_DIVISOR()
//     return { callFee: callFee, totalFee: totalFee, securityFee: securityFee, PERCENT_DIVISOR: PERCENT_DIVISOR }
// }

// const depositAll = async(web3,pool) => {
//     try {
//         const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//         const signer = provider.getSigner();
//         const userAddress = await signer.getAddress();
//         const vault = await new ethers.Contract(pool.vaultAddress, abis.vaultAbi, signer)
//         const tx = await vault.depositAll()
//         await tx.wait()
//     } catch (error) {
//         throw error
//     }
// }

// const withdrawAll = async(web3,pool) =>{
//     try {
//         const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//         const signer = provider.getSigner();
//         const userAddress = await signer.getAddress();
//         const vault = await new ethers.Contract(pool.vaultAddress, abis.vaultAbi, signer)
//         const tx = await vault.withdrawAll()
//         await tx.wait()
//     } catch (error) {
//         throw error
//     }
// }

// export{
//     withdrawAll,
//     depositAll,
//     getFees,
//     getPoolAprTVL,
//     getDepositTokenPriceInDollars,
//     harvest,
//     approve,
//     hasApproved,
//     totalEarnedByUser,
//     pricePerShare,
//     withdrawalUsingTokenPairValue,
//     withdrawFromVault,
//     depositIntoVault,
//     getAmountDeposited,
//     agreeToTerms,
//     hasAgreedToTerms,
//     getLPBalance,
//     getLPBalanceOfVault,
//     getRewardTokenBalance
    
// }


// async function GetDepositTokenPriceInDollars(web3,pool) {
//     const provider = new ethers.providers.Web3Provider(web3.currentProvider);
//     const signer = provider.getSigner();
//     var tokenPrice = await getLPTokenPrice(signer,pool);
//     return tokenPrice;
// }

// async function getTokenPerSecond(signer,pool) {
//     const rewardPool = await new ethers.Contract(pool.tokenPerSecondPoolAddress, getRewardsPersecondAbi(pool.tokenPerSecondPoolMethod), signer)
//     const rewardsPerSecond = await rewardPool[pool.tokenPerSecondPoolMethod]()
//     const poolInfo = await rewardPool.poolInfo(pool.tokenPerSecondPoolIndex)
//     const allocationPoints = await poolInfo.allocPoint
//     const totalAllocationPoint = await rewardPool.totalAllocPoint()
//     return rewardsPerSecond.mul(allocationPoints).div(totalAllocationPoint);
// }

// async function getLPTokenPrice(signer,pool) {
//     const tokenPair = await new ethers.Contract(pool.poolTokenPairAddress, abis.poolTokenPairAbi, signer)
//     const tokenOne = await new ethers.Contract(pool.poolTokenStatsAndLPTokenAddress, abis.poolTokenStatsAndLPTokenAbi, signer)
//     const totalSupply = getFullDisplayBalance(await tokenPair.totalSupply(), 18);
//     //Get amount of tokenA
//     const tokenSupply = getFullDisplayBalance(await tokenOne.balanceOf(pool.poolTokenPairAddress), 18);
//     // const stat = await getApexStat(signer)
//     const stat = await getTokenStats(signer,pool)
//     const priceOfToken = stat.priceInDollars;
//     const tokenInLP = Number(tokenSupply) / Number(totalSupply);
//     const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
//     return tokenPrice;
// }


// async function getTokenPriceFromPancakeswap(signer, routeToken) {
//     const chainID = 205
//     var wftm = new Token(chainID, WFTTokenAddress, 18);
//     const token = new Token(chainID, routeToken.address, routeToken.decimal, routeToken.name);
//     try {
//         const wftmToToken = await Fetcher.fetchPairData(token, wftm, signer);
//         const priceInBUSD = new Route([wftmToToken], token);
//         return priceInBUSD.midPrice.toFixed(4);
//     } catch (err) {
//         console.error(`Failed to fetch token price of ${"APEX"}: ${err}`);
//     }
// }
// async function getTokenStats(signer,pool){
//         const token = await new ethers.Contract(pool.poolTokenStatsAndLPTokenAddress, abis.poolTokenStatsAndLPTokenAbi, signer)
//         const supply = await token.totalSupply();
//         const rewardPoolSupply = await token.balanceOf(pool.poolTokenStatsAndLPAddress);
//         let CirculatingSupply = supply.sub(rewardPoolSupply);
//         if(pool.poolTokenMasterChefGenesisPoolAddress != null){
//             const genesisRewardPoolSupply = await token.balanceOf(pool.poolTokenMasterChefGenesisPoolAddress);
//             CirculatingSupply = supply.sub(genesisRewardPoolSupply);
//         }
//         const tokenForPrice = { address: pool.poolTokenStatsAndLPTokenAddress, decimal: 18, name: pool.poolTokenStatsAndLPTokenName }
//         const priceInFTM = await getTokenPriceFromPancakeswap(signer, tokenForPrice);
//         const priceOfOneFTM = await getWFTMPriceFromPancakeswap(signer);
//         const priceOfTombInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);
//         return {
//             ars: priceInFTM,
//             priceInDollars: priceOfTombInDollars,
//             totalSupply: getDisplayBalance(supply, 18, 0),
//             circulatingSupply: getDisplayBalance(CirculatingSupply, 18, 0),
//         };
//     }

// async function getApexStat(signer) {
//     const ApexToken = await new ethers.Contract(ApexTokenAddress, apexTokenAbi, signer)
//     const supply = await ApexToken.totalSupply();
//     const apexFtmGenesisRewardPoolSupply = await ApexToken.balanceOf(ApexFtmGenesisRewardpoolAddress);
//     const apexFtmRewardPoolSupply = await ApexToken.balanceOf(ApexFtmRewardPoolAddress);
//     const apexFtmCirculatingSupply = supply.sub(apexFtmGenesisRewardPoolSupply).sub(apexFtmRewardPoolSupply);
//     const token = { address: APEXTokenAdress, decimal: 18, name: "APEX" }
//     const priceInFTM = await getTokenPriceFromPancakeswap(signer, token);
//     const priceOfOneFTM = await getWFTMPriceFromPancakeswap(signer);
//     const priceOfTombInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);
//     return {
//         ars: priceOfTombInDollars,
//         priceInDollars: priceOfTombInDollars,
//         totalSupply: getDisplayBalance(supply, 18, 0),
//         circulatingSupply: getDisplayBalance(apexFtmCirculatingSupply, 18, 0),
//     };
// }

// async function getRewardTokenStat(signer, pool) {
//     const rewardToken = await new ethers.Contract(pool.rewardMasterChefTokenAddress, abis.rewardMasterChefTokenAbi, signer)
//     const supply = await rewardToken.totalSupply();
//     const token = { address: pool.rewardMasterChefTokenAddress, decimal: 18, symbol: pool.rewardMasterChefTokenName }
//     const priceInFTM = await getTokenPriceFromPancakeswap(signer, token);
//     const rewardPoolSupply = await rewardToken.balanceOf(pool.rewardMasterChefAddress);
//     const rewardCirculatingSupply = supply.sub(rewardPoolSupply);
//     const priceOfOneFTM = await getWFTMPriceFromPancakeswap(signer);
//     const priceOfRewardsInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

//     return {
//         tokenInFtm: priceInFTM,
//         priceInDollars: priceOfRewardsInDollars,
//         totalSupply: getDisplayBalance(supply, 18, 0),
//         circulatingSupply: getDisplayBalance(rewardCirculatingSupply, 18, 0),
//     };
// }


// async function getAShareStat(signer) {
//     const ashareToken = await new ethers.Contract(AshareTopkenAddress, ashare, signer)
//     const supply = await ashareToken.totalSupply();
//     const token = { address: AshareTopkenAddress, decimal: 18, symbol: "Ashare" }
//     const priceInFTM = await getTokenPriceFromPancakeswap(signer, token);
//     const tombRewardPoolSupply = await ashareToken.balanceOf(AshareRewardPoolAddress);
//     const tShareCirculatingSupply = supply.sub(tombRewardPoolSupply);
//     const priceOfOneFTM = await getWFTMPriceFromPancakeswap(signer);
//     const priceOfSharesInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

//     return {
//         tokenInFtm: priceInFTM,
//         priceInDollars: priceOfSharesInDollars,
//         totalSupply: getDisplayBalance(supply, 18, 0),
//         circulatingSupply: getDisplayBalance(tShareCirculatingSupply, 18, 0),
//     };
// }

// async function getWFTMPriceFromPancakeswap(signer) {
//     try {
//         const USDFTMLPTokenAddress = "0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c"
//         const WFTMTokenAddress = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83"
//         const USDCTokenAddress = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"
//         const wFtmToken = await new ethers.Contract(WFTMTokenAddress, wFtmAbi, signer)
//         const fUSDToken = await new ethers.Contract(USDCTokenAddress, fUSDTokenAbi, signer)
//         let fusdtWftmLpAmount = await wFtmToken.balanceOf(USDFTMLPTokenAddress);
//         let ftm_amount = Number(getFullDisplayBalance(fusdtWftmLpAmount, 18));
//         let fusdt_amount_BN = await fUSDToken.balanceOf(USDFTMLPTokenAddress);
//         let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, 6));
//         return (fusdt_amount / ftm_amount).toString();
//     } catch (err) {
//         console.error(`Failed to fetch token price of WFTM: ${err}`);
//     }
// }

