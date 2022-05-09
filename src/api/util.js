const { BigNumber } = require('ethers')

module.exports = {
    getFullDisplayBalance:function(balance, decimals = 18, isTruncated = false) {
        return getDisplayBalance(balance, decimals, 4, isTruncated);
    },
    
    getBalance:function(balance, decimals) {
        return Number(balance.div(BigNumber.from(10).pow(decimals)));
    },
    
    getDisplayBalance:function(
        balance,
        decimals = 18,
        fractionDigits = 4,
        isTruncated = false,
    ){
        if (decimals === 0) {
            fractionDigits = 0;
        }
        const number = getBalance(balance, decimals - fractionDigits);
        const ret = (number / 10 ** fractionDigits).toFixed(fractionDigits);
        if (ret.length > 12 && isTruncated) {
            return ret.slice(0, 12) + '...';
        }
        return ret;
    }
}


function getDisplayBalance(
    balance,
    decimals = 18,
    fractionDigits = 4,
    isTruncated = false,
){
    if (decimals === 0) {
        fractionDigits = 0;
    }
    const number = getBalance(balance, decimals - fractionDigits);
    const ret = (number / 10 ** fractionDigits).toFixed(fractionDigits);
    if (ret.length > 12 && isTruncated) {
        return ret.slice(0, 12) + '...';
    }
    return ret;
}

function getBalance(balance, decimals) {
    return Number(balance.div(BigNumber.from(10).pow(decimals)));
}

