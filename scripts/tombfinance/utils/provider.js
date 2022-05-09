"use strict";
exports.__esModule = true;
exports.getDefaultProvider = void 0;
var ethers_1 = require("ethers");
var mainConfig_1 = require("../mainConfig");
var ether_utils_1 = require("../ether-utils");
var provider = null;
function getDefaultProvider() {
    if (!provider) {
        provider = new ethers_1.ethers.providers.Web3Provider((0, ether_utils_1.web3ProviderFrom)(mainConfig_1["default"].defaultProvider), mainConfig_1["default"].chainId);
    }
    return provider;
}
exports.getDefaultProvider = getDefaultProvider;
