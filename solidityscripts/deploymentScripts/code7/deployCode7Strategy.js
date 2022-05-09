const { ethers } = require('hardhat')

const Code7FTMLPToken = "0xd4996a8654cf4Cd319Fc82E70430E4704f6e55D5"

module.exports = {
    deployStrategy:async function(vaultAddress, treasuryAddress){
        let Strategy = await ethers.getContractFactory("Code7AutoCompoundCode7FTM")
        let strategy = await Strategy.deploy(Code7FTMLPToken, 0, vaultAddress, treasuryAddress)
        await strategy.deployed()
        console.log(`Strategy has been deployed at: ${strategy.address}`)
        return strategy
    }
}

