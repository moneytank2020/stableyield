const { ethers } = require('hardhat')

const TombFTMLPToken = "0x2A651563C9d3Af67aE0388a5c8F89b867038089e"

module.exports = {
    deployStrategy:async function(vaultAddress, treasuryAddress){
        let Strategy = await ethers.getContractFactory("TombAutoCompoundTombFTM")
        let strategy = await Strategy.deploy(TombFTMLPToken, 0, vaultAddress, treasuryAddress)
        await strategy.deployed()
        console.log(`Strategy has been deployed at: ${strategy.address}`)
        return strategy
    }
}

