const { ethers } = require('hardhat')

let address = ""

let ashareAddress = ""

let vaultInstance = ""

module.exports = {
    deployVault: async function(){
        let Vault = await ethers.getContractFactory("AshareVault")
        let vault = await Vault.deploy("0x7Ff074fdc6F5831538902516CCCAD0ae63c8914b", "Asher-FTM vault", "acASHARE-FTM",432000)
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