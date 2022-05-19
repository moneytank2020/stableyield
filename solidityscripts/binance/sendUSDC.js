const { BigNumber } = require('ethers');
const { ethers } = require('hardhat')
const usdcAbi = require("../../contracts/abi/usdcabi.json")

async function main(){
    await getTokens()
}

async function getTokens(){
    const account = "0xFA3539a4B434af386d319F2041854A2FA9c3943e"
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [account],
      });
    const signer = await ethers.getSigner(account)
    const usdc = await new ethers.Contract("0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", usdcAbi , signer)
    const value = BigNumber.from("500000000000000000000")
    const tokenTransfer = await usdc.transfer("0x8d449a93D2155D8cF4d2ee85effCAe914F401cfd",value)
    await tokenTransfer.wait()
}

main()
.then(()=> process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
})