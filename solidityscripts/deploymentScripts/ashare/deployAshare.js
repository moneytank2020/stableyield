const { ethers } = require('hardhat')
const treasuryDeployer = require('./deployAshareTreasury')
const vaultDeployer = require('./deployAshareVault')
const strategyDeployer = require('./deployAshareStrategy')
const fs = require('fs')

async function main(){
    let treasury = await treasuryDeployer.deployTreasury()
    let vault = await vaultDeployer.deployVault()
    console.log(`vault address:${vault.getAddress()}`)
    console.log(`treasury address:${treasury.address}`)
    let strategy = await strategyDeployer.deployStrategy(vault.getAddress(), treasury.address)
    await vault.initializeVault(strategy.address)
    console.log("process complete")
    console.log(`{\n "treasuryAddress":"${treasury.address}",\n"vaultAddress":"${vault.getAddress()}",\n"strategyAddress":"${strategy.address}"\n}`)
    const content = `{\n "treasuryAddress":"${treasury.address}",\n"vaultAddress":"${vault.getAddress()}",\n"strategyAddress":"${strategy.address}"\n}`
    fs.writeFileSync('./src/api/constants.json', content)
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.log(error)
    process.exit(1)
})