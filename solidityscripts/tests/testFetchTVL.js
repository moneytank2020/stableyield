const { ethers } = require('hardhat');
const { BigNumber } = require('ethers');
const { Fetcher, Token, Route }  = require('@spookyswap/sdk');
const apexFtmAbi = require('../../contracts/abi/apexFtmAbi.json')
const apexTokenAbi = require('../../contracts/abi/apexTokenAbi.json')
const wFtmAbi = require('../../contracts/abi/wftmabi.json')
const fUSDTokenAbi = require('../../contracts/abi/usdtAbi.json')


async function main() {
    await testGetLPPrice()
}

async function testGetLPPrice() {
    const price = await getDepositTokenPriceInDollars()
    console.log("lp price", price)
}


async function getDepositTokenPriceInDollars() {
    const [signer] = await ethers.getSigners()
    var tokenPrice = await getLPTokenPrice(signer);
    return tokenPrice;
  }


  async function getLPTokenPrice(signer) {
    const ApexFtmLpTokenAddress = "0x78e7743bA9b517fe4737DAa64687900790793D26" 
    const ApexTokenAddress = "0x065d934ca7350676c70df4be1c83515d275c11ee"
    const ApexFtmLpToken = await new ethers.Contract(ApexFtmLpTokenAddress, apexFtmAbi, signer)
    const ApexToken = await new ethers.Contract(ApexTokenAddress, apexTokenAbi, signer)
    const totalSupply = getFullDisplayBalance(await ApexFtmLpToken.totalSupply(), 18);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await ApexToken.balanceOf(ApexFtmLpTokenAddress), 18);
    const stat = await getApexStat(signer)
    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

async function getTokenPriceFromPancakeswap(signer) {
    const WFTTokenAddress = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83"
    const APEXTokenAdress = "0x065d934ca7350676c70df4be1c83515d275c11ee"
    const chainID = 205
    var wftm = new Token(chainID, WFTTokenAddress, 18);
    const token = new Token(chainID, APEXTokenAdress, 18, "APEX");
    const wftmToToken = await Fetcher.fetchPairData(token, wftm, signer);
    const priceInBUSD = new Route([wftmToToken], token);
    try {
        const wftmToToken = await Fetcher.fetchPairData(token, wftm, signer);
        const priceInBUSD = new Route([wftmToToken], token);
        return priceInBUSD.midPrice.toFixed(4);
    } catch (err) {
        console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
}

async function getApexStat(signer) {
    const ApexTokenAddress = "0x065d934ca7350676c70df4be1c83515d275c11ee"
    const ApexFtmGenesisRewardpoolAddress = "0xccf0adc83407e1857d9dbbcf753ed61893436b5e"
    var ApexFtmRewardPoolAddress = "0xc29b170eedfad89308f13990bb9b5186997ce475"
    var ApexToken = await new ethers.Contract(ApexTokenAddress, apexTokenAbi, signer)
    const supply = await ApexToken.totalSupply();
    const apexFtmGenesisRewardPoolSupply = await ApexToken.balanceOf(ApexFtmGenesisRewardpoolAddress);
    const apexFtmRewardPoolSupply = await ApexToken.balanceOf(ApexFtmRewardPoolAddress);
    const apexFtmCirculatingSupply = supply.sub(apexFtmGenesisRewardPoolSupply).sub(apexFtmRewardPoolSupply);
    const priceInFTM = await getTokenPriceFromPancakeswap(signer);
    const priceOfOneFTM = await getWFTMPriceFromPancakeswap(signer);
    const priceOfTombInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);
    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfTombInDollars,
      totalSupply: getDisplayBalance(supply, 18, 0),
      circulatingSupply: getDisplayBalance(apexFtmCirculatingSupply, 18, 0),
    };
  }

async function getWFTMPriceFromPancakeswap(signer) {
    try {
        const USDFTMLPTokenAddress = "0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c"
        const WFTMTokenAddress = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83"
        const USDCTokenAddress = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"
        const wFtmToken = await new ethers.Contract(WFTMTokenAddress, wFtmAbi, signer)
        const fUSDToken = await new ethers.Contract(USDCTokenAddress, fUSDTokenAbi, signer)
        let fusdtWftmLpAmount = await wFtmToken.balanceOf(USDFTMLPTokenAddress);
        let ftm_amount = Number(getFullDisplayBalance(fusdtWftmLpAmount, 18));
        let fusdt_amount_BN = await fUSDToken.balanceOf(USDFTMLPTokenAddress);
        let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, 6));
        return (fusdt_amount / ftm_amount).toString();
    } catch (err) {
        console.error(`Failed to fetch token price of WFTM: ${err}`);
    }
}

const getFullDisplayBalance = (balance, decimals = 18, isTruncated = false) => {
    return getDisplayBalance(balance, decimals, 4, isTruncated);
  };

function getBalance(balance, decimals) {
    return Number(balance.div(BigNumber.from(10).pow(decimals)));
}

const getDisplayBalance = (
    balance,
    decimals = 18,
    fractionDigits = 4,
    isTruncated = false,
) => {
    if (decimals === 0) {
        fractionDigits = 0;
    }
    const number = getBalance(balance, decimals - fractionDigits);
    const ret = (number / 10 ** fractionDigits).toFixed(fractionDigits);
    if (ret.length > 12 && isTruncated) {
        return ret.slice(0, 12) + '...';
    }
    return ret;
};

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    })