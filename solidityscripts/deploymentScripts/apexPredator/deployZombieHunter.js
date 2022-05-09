const { ethers } = require('hardhat')
const fs = require('fs')

async function main(){
    let ZombieHunter = await ethers.getContractFactory("Zombiehunter")
    let zombieHunter = await ZombieHunter.deploy()
    await zombieHunter.openHunt()
    console.log(`ZombieHunter has been deployed at ${zombieHunter.address}`)
    console.log(`{\n "ZombieHunter":"${zombieHunter.address}",\n}`)
    const content = `{\n "ZombieHunter":"${zombieHunter.address}",\n}`
    fs.writeFileSync('./src/api/apexConstant.json', content)
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.log(error)
    process.exit(1)
})