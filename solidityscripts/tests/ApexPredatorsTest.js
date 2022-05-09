const { ethers } = require('hardhat');
const abi = require('../../contracts/abi/wftmabi.json')
const ashareAbi = require('../../contracts/abi/wftmabi.json')
const uniswap = require('../../contracts/abi/uniswapAbi.json')
const apexAutoCompundApexFtmAbi = require('../../contracts/abi/apexAutoCompoundApexFtm.json')
const constants = require('../../src/api/constants.json')
const apexPredators = "0x51A1ceB83B83F1985a81C295d1fF28Afef186E02"
const zombieHunter = "0x51A1ceB83B83F1985a81C295d1fF28Afef186E02"
const apexPredatorsAbi = require('./apexPredators.json')
const apexAbi = require('./apexAbi.json')
const zombieAbi = require('./zombieAbi.json')
const harvestBot ="0x04F11391b24acBAAAd1Bfe2C3cd8A4396A75fC51"
const apexWallet = "0xfd92625d8CA47d8c225b9d3350df72B2AeF988D9"
const apexTokens = "0x065d934Ca7350676C70df4be1c83515D275C11ee"
const localhostTest = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
async function getSigner(){
    const account = apexWallet
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [account],
      });
    const signer = await ethers.getSigner(account)
    return signer
}

async function main(){
    var isAllowed =  await hasApproved()
    if(!isAllowed){
        await approve()
    }
    await huntPrey()
    await getBalance()
    await eatPrey()
    await getBalance()
    // await zombihunter()
    // await huntZombie()
}


async function zombihunter(){
    const signer = await getSigner();
    const userAddress = await signer.getAddress();
    console.log("userAddress:",userAddress)
    const apexPredatorContract = await new ethers.Contract(zombieHunter, zombieAbi, signer)
    let overrides = {
        value: ethers.utils.parseEther("3")     // ether in this case MUST be a string
    };
    const hunterZombie = await apexPredatorContract.huntZombies("0x0205E7FecC2d09498A35b6C44E7A6909BDf9C9af", overrides)
    await hunterZombie.wait()
    const sell = await apexPredatorContract.sellZombies()
    await sell.wait()
    // const balance = await apexPredatorContract.getBalance()
    // console.log("hunterZombie:",balance)
    // console.log("hunterZombie:",hunterZombie)
}

async function eatPrey(){
    const signer = await getSigner();
    const userAddress = await signer.getAddress();
    const apexPredatorContract = await new ethers.Contract(apexPredators, apexPredatorsAbi, signer)
    const sell = await apexPredatorContract.eatPrey()
    await sell.wait()

}


async function approve(){
    try {
        const signer = await getSigner();
        const token = await new ethers.Contract(apexTokens, apexAbi, signer);
        const tx = await token.approve(apexPredators, ethers.constants.MaxInt256);
        const receipt = await tx.wait();
        if (receipt.status) {
           console.log("done")
            return true
        }
    } catch (error) {
        console.log("error:",error)
        throw error
    }
}

async function hasApproved(){
    const signer = await getSigner();
    const userAddress = await signer.getAddress();
    const token = await new ethers.Contract(apexTokens, apexAbi, signer);
    const allowance = await token.allowance(userAddress, apexPredators);
    const isAllowed = Number(allowance) !== 0
    console.log("isAllowed:",isAllowed)
    return isAllowed
}

async function getBalance(){
    const signer = await getSigner();
    const userAddress = await signer.getAddress();
    const apexPredatorContract = await new ethers.Contract(apexPredators, apexPredatorsAbi, signer)
    const balance = await apexPredatorContract.getBalance()
    console.log("balance:",balance)
}

async function huntPrey(){
    const signer = await getSigner();
    const userAddress = await signer.getAddress();
    const apexPredatorContract = await new ethers.Contract(apexPredators, apexPredatorsAbi, signer)
    const hunterZombie = await apexPredatorContract.huntPrey(ethers.utils.parseEther("10"),"0xfd92625d8CA47d8c225b9d3350df72B2AeF988D9")
    await hunterZombie.wait()
}


main()
.then(()=> process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
})