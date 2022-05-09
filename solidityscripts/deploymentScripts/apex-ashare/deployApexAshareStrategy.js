const { ethers } = require('hardhat')

const ApexAshareLPToken = "0xCf9940c5712297317565209E536eE7F2Ba0b4BBd"

module.exports = {
    deployStrategy:async function(vaultAddress, treasuryAddress){
        let Strategy = await ethers.getContractFactory("AshareAutoCompoundApexAshare")
        let strategy = await Strategy.deploy(ApexAshareLPToken, 3, vaultAddress, treasuryAddress)
        await strategy.deployed()
        console.log(`Strategy has been deployed at: ${strategy.address}`)
        return strategy
    }
}

