"use strict";
exports.__esModule = true;
exports.getBalance = exports.getFullDisplayBalance = exports.getDisplayBalance = void 0;
var ethers_1 = require("ethers");
var getDisplayBalance = function (balance, decimals, fractionDigits, isTruncated) {
    if (decimals === void 0) { decimals = 18; }
    if (fractionDigits === void 0) { fractionDigits = 4; }
    if (isTruncated === void 0) { isTruncated = false; }
    if (decimals === 0) {
        fractionDigits = 0;
    }
    var number = getBalance(balance, decimals - fractionDigits);
    var ret = (number / Math.pow(10, fractionDigits)).toFixed(fractionDigits);
    if (ret.length > 12 && isTruncated) {
        return ret.slice(0, 12) + '...';
    }
    return ret;
};
exports.getDisplayBalance = getDisplayBalance;
var getFullDisplayBalance = function (balance, decimals, isTruncated) {
    if (decimals === void 0) { decimals = 18; }
    if (isTruncated === void 0) { isTruncated = false; }
    return (0, exports.getDisplayBalance)(balance, decimals, 4, isTruncated);
};
exports.getFullDisplayBalance = getFullDisplayBalance;
function getBalance(balance, decimals) {
    if (decimals === void 0) { decimals = 18; }
    return Number(balance.div(ethers_1.BigNumber.from(10).pow(decimals)));
}
exports.getBalance = getBalance;
