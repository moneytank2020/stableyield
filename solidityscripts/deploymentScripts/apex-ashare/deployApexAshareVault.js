const { ethers } = require('hardhat')

let address = ""

let ashareAddress = ""

let vaultInstance = ""

module.exports = {
    deployVault: async function(){
        let Vault = await ethers.getContractFactory("ApexAshareVault")
        let vault = await Vault.deploy("0xCf9940c5712297317565209E536eE7F2Ba0b4BBd", "Apex-Ashare vault", "acAPEX-ASHARE",432000)
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