
let testString = "initial start"

module.exports = {
    methodForTest:async function(value){
        console.log(`test worked with value ${value}`)
        testString = value
        return this
    },

    methodToTestForReturn:async function(){
        console.log(testString)
    },

    getTestString:function(){
        return testString
    }
}
