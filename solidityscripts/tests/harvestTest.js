const { ethers } = require('hardhat');
const strategyAddress = "0x36b58F5C1969B7b6591D752ea6F5486D069010AB"
const apexAutoCompundApexFtmAbi = require('../../contracts/abi/apexAutoCompoundApexFtm.json')


async function main(){
    try{
        await harvest()
    }catch(error){
        console.log("error:",error)
    }
}

const harvest = async () => {
    const account = "0x04F11391b24acBAAAd1Bfe2C3cd8A4396A75fC51"
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [account],
      });
    const signer = await ethers.getSigner(account)
    const userAddress = await signer.getAddress();
    const strategy = await new ethers.Contract(strategyAddress, apexAutoCompundApexFtmAbi, signer)
    await strategy.harvest()
}

main()
.then(()=> process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
})