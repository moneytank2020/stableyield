const { ethers } = require('hardhat')

let address = ""

let ashareAddress = ""

let vaultInstance = ""

module.exports = {
    deployVault: async function(){
        let Vault = await ethers.getContractFactory("TombVault")
        let vault = await Vault.deploy("0x2A651563C9d3Af67aE0388a5c8F89b867038089e", "Tomb-FTM vault", "acTOMB-FTM",432000)
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