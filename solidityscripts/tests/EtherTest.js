const { ethers } = require('hardhat');
const abi = require('../../contracts/abi/wftmabi.json')
const ashareAbi = require('../../contracts/abi/wftmabi.json')
const uniswap = require('../../contracts/abi/uniswapAbi.json')
const apexAutoCompundApexFtmAbi = require('../../contracts/abi/apexAutoCompoundApexFtm.json')
const constants = require('../../src/api/constants.json')
async function getSigner(){
    const account = "0x0f2A144d711E7390d72BD474653170B201D504C8"
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [account],
      });
    const signer = await ethers.getSigner(account)
    return signer
}

async function main(){
    // await testGetTokenWithContractInstance()
    // await testGetTokenWithContentFactory()
    // await testGetWFTMWithContractInstance()
    // await testGetASharesWithContractInstance()
    // await getVaultContract()
    await getCallFees()
    // let spookyFactory = await getContractWithNameAndAddress("0x1C9324d4C71602Af7874A48d76d48f8a9E1b87Bb", "AShares")
    // console.log("factory feeto:", await spookyFactory.name())
}


async function testGetTokenWithContentFactory(){
    const token = await ethers.getContractFactory("Ashares")
    const theToken = await token.attach("0x1C9324d4C71602Af7874A48d76d48f8a9E1b87Bb")
    console.log("name:",await theToken.owner())
}

async function testGetTokenWithContractInstance(){
    const signer = await getSigner()
    const wftmabi = [abi]
     const token = await new ethers.Contract("0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", wftmabi,signer)
    console.log("name:",await token.owner())
}


async function testGetWFTMWithContractInstance(){
    // const token = await ethers.getContractFactory("WrappedFtm")
    // const theToken = await token.attach("0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83")
    // console.log("name:",await theToken.balanceOf("0x0f2A144d711E7390d72BD474653170B201D504C8"))
    const signer = await getSigner()
     const token = await new ethers.Contract("0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", abi,signer)
    console.log("name:",await token.name())
    console.log("name:",await token.balanceOf("0x0f2A144d711E7390d72BD474653170B201D504C8"))
}


async function testGetASharesWithContractInstance(){
    const signer = await getSigner()
     const token = await new ethers.Contract("0x1C9324d4C71602Af7874A48d76d48f8a9E1b87Bb", ashareAbi, signer)
    console.log("name:",await token.name())
    console.log("name:",await token.balanceOf("0xfd92625d8CA47d8c225b9d3350df72B2AeF988D9"))
}


// async function testGetTokenWithContractInstance(){
//     const signer = await getSigner()
//      const token = await new ethers.Contract("0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE", abi,signer)
//     console.log("name:",await token.owner())
// }

async function getContractWithNameAndAddress(address, contractName){
    const Token = await ethers.getContractFactory(contractName)
    const token = await Token.attach(address)
    return token
}


async function getVaultContract(){
    const Vault = await ethers.getContractFactory("ApexVault")
    const vault = await Vault.attach(constants.Vault)
    console.log("vault name:", await vault.name())
}

async function getTokens(){

    const account = "0x0000000000000000000000000000000000000000"
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [account],
      });
    const signer = await ethers.getSigner(account)
    const token = await ethers.getContractFactory("WrappedFtm")
    const Uniswap = await ethers.Contract("0xF491e7B69E4244ad4002BC14e878a34207E38c29",uniswap,getSigner())
    const trade = await Uniswap.swapExactTokensForTokensSupportingFeeOnTransferTokens()
}

async function getCallFees(){
    const signer = await getSigner();
    const userAddress = await signer.getAddress();
    const strategy = await new ethers.Contract(constants.Strategy, apexAutoCompundApexFtmAbi, signer)
    const callFee = await strategy.callFee()
    const securityFee = await strategy.securityFee()
    const totalFee = await strategy.totalFee()
    const PERCENT_DIVISOR = await strategy.PERCENT_DIVISOR()
    console.log("fees:%s,%s,%s,%s",callFee,securityFee,totalFee,PERCENT_DIVISOR)
}

main()
.then(()=> process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
})