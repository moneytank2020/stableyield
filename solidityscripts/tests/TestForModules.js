const testsub = require('../testSubscript')

async function main(){
    let testing = await testsub.methodForTest("new value")
    console.log(testing.getTestString())

}

main()
.then(() => process.exit(0))
.catch(error => {
    console.log(error)
    process.exit(1)
})