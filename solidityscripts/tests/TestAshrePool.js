const aSharePoolAbi = require("../../contracts/abi/asharePoolAbi.json")
const constants = require("../../src/constants.json")

async function main(){
    await getTokens()
}

async function getTokens(){
    const account = "0xfd92625d8CA47d8c225b9d3350df72B2AeF988D9"
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [account],
      });
    const signer = await ethers.getSigner(account)
    const aShareToken = await new ethers.Contract("0xac23f2627fff0a29c41e4cbd8087f106cfa1b162", aSharePoolAbi , signer)
    const balance = await aShareToken.userInfo(0,constants.Strategy)
      console.log(balance)
}

main()
.then(()=> process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
})