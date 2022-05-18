const { ethers } = require('hardhat')
const fs = require('fs')

async function main(){
    let StableYieldContract = await ethers.getContractFactory("StableYield")
    let stableYield = await StableYieldContract.deploy()
    await stableYield.deployed()
    await stableYield.provideMarket()
    console.log("procces complete")
    console.log(`{\n "stableYieldContract":"${stableYield.address}"\n}`)
    const content = `{\n "stableYieldContract":"${stableYield.address}"\n}`
    fs.writeFileSync('./src/api/constants.json', content)
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.log(error)
    process.exit(1)
})