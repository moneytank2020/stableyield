const { ethers } = require("hardhat")

module.exports = {
    deployTreasury: async function () {
        let Treasury = await ethers.getContractFactory("AshareTreasury")
        let treasury = await Treasury.deploy()
        await treasury.deployed()
        console.log(`Treasury has been deployed at ${treasury.address}`)
        return treasury
    }
}
