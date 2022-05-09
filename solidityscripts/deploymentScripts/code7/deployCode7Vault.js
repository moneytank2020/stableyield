const { ethers } = require('hardhat')

let address = ""

let ashareAddress = ""

let vaultInstance = ""

module.exports = {
    deployVault: async function(){
        let Vault = await ethers.getContractFactory("Code7Vault")
        let vault = await Vault.deploy("0xd4996a8654cf4Cd319Fc82E70430E4704f6e55D5", "Code7-FTM vault", "acCODE7-FTM",432000)
        await vault.deployed()
        console.log(`Vault has been deployed at ${vault.address}`)
        address = vault.address
        vaultInstance = vault
        return this
    },


    getAddress:function(){
        return address
    },

    initializeVault: async function(strategyAddress){
        await vaultInstance.initialize(strategyAddress)
        console.log("vault initialized")
    },
}