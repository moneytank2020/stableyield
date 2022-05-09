const { ethers } = require('hardhat')

const AshareFTMLPToken = "0x7Ff074fdc6F5831538902516CCCAD0ae63c8914b"

module.exports = {
    deployStrategy:async function(vaultAddress, treasuryAddress){
        let Strategy = await ethers.getContractFactory("AshareAutoCompoundAshareFTM")
        let strategy = await Strategy.deploy(AshareFTMLPToken, 1, vaultAddress, treasuryAddress)
        await strategy.deployed()
        console.log(`Strategy has been deployed at: ${strategy.address}`)
        return strategy
    }
}

