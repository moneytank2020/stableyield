const { ethers } = require('hardhat')
const fs = require('fs')

async function main(){
    let ApexPredator = await ethers.getContractFactory("ApexPredator")
    let apexPredator = await ApexPredator.deploy()
    await apexPredator.openHunt()
    console.log(`ApexPredator has been deployed at ${apexPredator.address}`)
    console.log(`{\n "ApexPredator":"${apexPredator.address}",\n}`)
    const content = `{\n "ApexPredator":"${apexPredator.address}",\n}`
    fs.writeFileSync('./src/api/apexConstant.json', content)
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.log(error)
    process.exit(1)
})