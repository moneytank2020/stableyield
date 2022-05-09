const { ethers } = require('hardhat')

const BasedTombLPToken = "0xaB2ddCBB346327bBDF97120b0dD5eE172a9c8f9E"

module.exports = {
    deployStrategy:async function(vaultAddress, treasuryAddress){
        let Strategy = await ethers.getContractFactory("BasedAutoCompoundBasedTomb")
        let strategy = await Strategy.deploy(BasedTombLPToken, 0, vaultAddress, treasuryAddress)
        await strategy.deployed()
        console.log(`Strategy has been deployed at: ${strategy.address}`)
        return strategy
    }
}

