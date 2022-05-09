"use strict";
exports.__esModule = true;
exports.decimalToBalance = exports.balanceToDecimal = exports.web3ProviderFrom = void 0;
var web3_1 = require("web3");
var config_1 = require("./config");
var utils_1 = require("ethers/lib/utils");
function web3ProviderFrom(endpoint, config) {
    var ethConfig = Object.assign(config_1.defaultEthereumConfig, config || {});
    var providerClass = endpoint.includes('wss') ? web3_1["default"].providers.WebsocketProvider : web3_1["default"].providers.HttpProvider;
    return new providerClass(endpoint, {
        timeout: ethConfig.ethereumNodeTimeout
    });
}
exports.web3ProviderFrom = web3ProviderFrom;
function balanceToDecimal(s) {
    return (0, utils_1.formatUnits)(s);
}
exports.balanceToDecimal = balanceToDecimal;
function decimalToBalance(d, decimals) {
    if (decimals === void 0) { decimals = 18; }
    return (0, utils_1.parseUnits)(String(d), decimals);
}
exports.decimalToBalance = decimalToBalance;
