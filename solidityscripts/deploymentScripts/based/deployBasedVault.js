const { ethers } = require('hardhat')

let address = ""

let ashareAddress = ""

let vaultInstance = ""

module.exports = {
    deployVault: async function(){
        let Vault = await ethers.getContractFactory("BasedVault")
        let vault = await Vault.deploy("0xab2ddcbb346327bbdf97120b0dd5ee172a9c8f9e", "Based-Tomb vault", "acBASED-TOMB",432000)
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