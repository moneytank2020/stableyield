const { ethers } = require('hardhat')

let address = ""

let vaultInstance = ""

module.exports = {
    deployVault: async function () {
        let Vault = await ethers.getContractFactory("ApexVault")
        let vault = await Vault.deploy("0x78e7743bA9b517fe4737DAa64687900790793D26", "Apex-FTM vault", "acAPEX-FTM",432000)
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
    }
}