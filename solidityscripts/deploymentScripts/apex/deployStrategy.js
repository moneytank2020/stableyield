const { ethers } = require('hardhat')

const ApexFTMLPToken = "0x78e7743bA9b517fe4737DAa64687900790793D26"

module.exports = {
    deployStrategy:async function(vaultAddress, treasuryAddress){
        let Strategy = await ethers.getContractFactory("ApexAutoCompoundApexFTM")
        let strategy = await Strategy.deploy(ApexFTMLPToken, 0, vaultAddress, treasuryAddress)
        await strategy.deployed()
        console.log(`Strategy has been deployed at: ${strategy.address}`)
        return strategy
    }
}

