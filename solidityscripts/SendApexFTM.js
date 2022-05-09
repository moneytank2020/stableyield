const { ethers } = require("hardhat");
const constants = require("../src/constants.json")
const vaultAbi = require('../contracts/abi/apexVaultAbi.json')

async function main(){
    await getTokens()
}

async function getTokens(){
    const ApexFtmAccount = "0xfd92625d8CA47d8c225b9d3350df72B2AeF988D9"
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [ApexFtmAccount],
      });
    const apexFtmSigner = await ethers.getSigner(ApexFtmAccount)
    const vault = await new ethers.Contract(constants.Vault, vaultAbi, apexFtmSigner)
    const balance = await vault.balance()
    // const balance = await token.balanceOf(address)
    return ethers.utils.formatEther(balance)

    // const ApexFtmAccount = "0xfd92625d8CA47d8c225b9d3350df72B2AeF988D9"
    // await hre.network.provider.request({
    //     method: "hardhat_impersonateAccount",
    //     params: [ApexFtmAccount],
    //   });
    // const apexFtmSigner = await ethers.getSigner(ApexFtmAccount)
    // const ApexFtmToken = await ethers.getContractFactory("UniswapV2Pair")
    // const apexFtmToken = await ApexFtmToken.attach("0x78e7743bA9b517fe4737DAa64687900790793D26")
    // const amount = await apexFtmToken.balanceOf("0xfd92625d8CA47d8c225b9d3350df72B2AeF988D9")
    // console.log("balance:",ethers.utils.formatEther(amount))
}

main()
.then(()=> process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
})