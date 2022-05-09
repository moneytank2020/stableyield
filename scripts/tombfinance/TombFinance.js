"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.TombFinance = void 0;
// import { Fetcher, Route, Token } from '@uniswap/sdk';
var sdk_1 = require("@spiritswap/sdk");
var sdk_2 = require("@spookyswap/sdk");
var ethers_1 = require("ethers");
var ether_utils_1 = require("./ether-utils");
var ERC20_1 = require("./ERC20");
var formatBalance_1 = require("./utils/formatBalance");
var provider_1 = require("./utils/provider");
var IUniswapV2Pair_abi_json_1 = require("./IUniswapV2Pair.abi.json");
var mainConfig_1 = require("./mainConfig");
var moment_1 = require("moment");
var utils_1 = require("ethers/lib/utils");
var constants_1 = require("./utils/constants");
/**
 * An API module of Apex Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
var TombFinance = /** @class */ (function () {
    function TombFinance(cfg) {
        var deployments = cfg.deployments, externalTokens = cfg.externalTokens;
        var provider = (0, provider_1.getDefaultProvider)();
        // loads contracts from deployments
        this.contracts = {};
        for (var _i = 0, _a = Object.entries(deployments); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], deployment = _b[1];
            this.contracts[name_1] = new ethers_1.Contract(deployment.address, deployment.abi, provider);
        }
        this.externalTokens = {};
        for (var _c = 0, _d = Object.entries(externalTokens); _c < _d.length; _c++) {
            var _e = _d[_c], symbol = _e[0], _f = _e[1], address = _f[0], decimal = _f[1];
            this.externalTokens[symbol] = new ERC20_1["default"](address, provider, symbol, decimal);
        }
        this.APEX = new ERC20_1["default"](deployments.tomb.address, provider, 'APEX');
        this.ASHARE = new ERC20_1["default"](deployments.tShare.address, provider, 'ASHARE');
        this.ABOND = new ERC20_1["default"](deployments.tBond.address, provider, 'ABOND');
        this.FTM = this.externalTokens['WFTM'];
        // Uniswap V2 Pair
        this.TOMBWFTM_LP = new ethers_1.Contract(externalTokens['APEX-FTM-LP'][0], IUniswapV2Pair_abi_json_1["default"], provider);
        this.config = cfg;
        this.provider = provider;
    }
    /**
     * @param provider From an unlocked wallet. (e.g. Metamask)
     * @param account An address of unlocked wallet account.
     */
    TombFinance.prototype.unlockWallet = function (provider, account) {
        var _this = this;
        var newProvider = new ethers_1.ethers.providers.Web3Provider(provider, this.config.chainId);
        this.signer = newProvider.getSigner(0);
        this.myAccount = account;
        for (var _i = 0, _a = Object.entries(this.contracts); _i < _a.length; _i++) {
            var _b = _a[_i], name_2 = _b[0], contract = _b[1];
            this.contracts[name_2] = contract.connect(this.signer);
        }
        var tokens = __spreadArray([this.APEX, this.ASHARE, this.ABOND], Object.values(this.externalTokens), true);
        for (var _c = 0, tokens_1 = tokens; _c < tokens_1.length; _c++) {
            var token = tokens_1[_c];
            token.connect(this.signer);
        }
        this.TOMBWFTM_LP = this.TOMBWFTM_LP.connect(this.signer);
        console.log("\uD83D\uDD13 Wallet is unlocked. Welcome, ".concat(account, "!"));
        this.fetchMasonryVersionOfUser()
            .then(function (version) { return (_this.masonryVersionOfUser = version); })["catch"](function (err) {
            console.error("Failed to fetch masonry version: ".concat(err.stack));
            _this.masonryVersionOfUser = 'latest';
        });
    };
    Object.defineProperty(TombFinance.prototype, "isUnlocked", {
        get: function () {
            return !!this.myAccount;
        },
        enumerable: false,
        configurable: true
    });
    //===================================================================
    //===================== GET ASSET STATS =============================
    //===================FROM SPOOKY TO DISPLAY =========================
    //=========================IN HOME PAGE==============================
    //===================================================================
    TombFinance.prototype.getTombStat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ApexFtmRewardPool, ApexFtmLPApexRewardPool, ApexFtmLPApexRewardPoolOld, supply, tombRewardPoolSupply, tombRewardPoolSupply2, tombCirculatingSupply, priceInFTM, priceOfOneFTM, priceOfTombInDollars;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.contracts, ApexFtmRewardPool = _a.ApexFtmRewardPool, ApexFtmLPApexRewardPool = _a.ApexFtmLPApexRewardPool, ApexFtmLPApexRewardPoolOld = _a.ApexFtmLPApexRewardPoolOld;
                        return [4 /*yield*/, this.APEX.totalSupply()];
                    case 1:
                        supply = _b.sent();
                        return [4 /*yield*/, this.APEX.balanceOf(ApexFtmRewardPool.address)];
                    case 2:
                        tombRewardPoolSupply = _b.sent();
                        return [4 /*yield*/, this.APEX.balanceOf(ApexFtmLPApexRewardPool.address)];
                    case 3:
                        tombRewardPoolSupply2 = _b.sent();
                        tombCirculatingSupply = supply
                            .sub(tombRewardPoolSupply)
                            .sub(tombRewardPoolSupply2);
                        return [4 /*yield*/, this.getTokenPriceFromPancakeswap(this.APEX)];
                    case 4:
                        priceInFTM = _b.sent();
                        return [4 /*yield*/, this.getWFTMPriceFromPancakeswap()];
                    case 5:
                        priceOfOneFTM = _b.sent();
                        priceOfTombInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);
                        return [2 /*return*/, {
                                tokenInFtm: priceInFTM,
                                priceInDollars: priceOfTombInDollars,
                                totalSupply: (0, formatBalance_1.getDisplayBalance)(supply, this.APEX.decimal, 0),
                                circulatingSupply: (0, formatBalance_1.getDisplayBalance)(tombCirculatingSupply, this.APEX.decimal, 0)
                            }];
                }
            });
        });
    };
    /**
     * Calculates various stats for the requested LP
     * @param name of the LP token to load stats for
     * @returns
     */
    TombFinance.prototype.getLPStat = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var lpToken, lpTokenSupplyBN, lpTokenSupply, token0, isTomb, tokenAmountBN, tokenAmount, ftmAmountBN, ftmAmount, tokenAmountInOneLP, ftmAmountInOneLP, lpTokenPrice, lpTokenPriceFixed, liquidity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lpToken = this.externalTokens[name];
                        return [4 /*yield*/, lpToken.totalSupply()];
                    case 1:
                        lpTokenSupplyBN = _a.sent();
                        lpTokenSupply = (0, formatBalance_1.getDisplayBalance)(lpTokenSupplyBN, 18);
                        token0 = name.startsWith('APEX') ? this.APEX : this.ASHARE;
                        isTomb = name.startsWith('APEX');
                        return [4 /*yield*/, token0.balanceOf(lpToken.address)];
                    case 2:
                        tokenAmountBN = _a.sent();
                        tokenAmount = (0, formatBalance_1.getDisplayBalance)(tokenAmountBN, 18);
                        return [4 /*yield*/, this.FTM.balanceOf(lpToken.address)];
                    case 3:
                        ftmAmountBN = _a.sent();
                        ftmAmount = (0, formatBalance_1.getDisplayBalance)(ftmAmountBN, 18);
                        tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
                        ftmAmountInOneLP = Number(ftmAmount) / Number(lpTokenSupply);
                        return [4 /*yield*/, this.getLPTokenPrice(lpToken, token0, isTomb)];
                    case 4:
                        lpTokenPrice = _a.sent();
                        lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
                        liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();
                        return [2 /*return*/, {
                                tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
                                ftmAmount: ftmAmountInOneLP.toFixed(2).toString(),
                                priceOfOne: lpTokenPriceFixed,
                                totalLiquidity: liquidity,
                                totalSupply: Number(lpTokenSupply).toFixed(2).toString()
                            }];
                }
            });
        });
    };
    /**
     * Use this method to get price for Apex
     * @returns TokenStat for ABOND
     * priceInFTM
     * priceInDollars
     * TotalSupply
     * CirculatingSupply (always equal to total supply for bonds)
     */
    TombFinance.prototype.getBondStat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury, tombStat, bondTombRatioBN, modifier, bondPriceInFTM, priceOfTBondInDollars, supply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Treasury = this.contracts.Treasury;
                        return [4 /*yield*/, this.getTombStat()];
                    case 1:
                        tombStat = _a.sent();
                        return [4 /*yield*/, Treasury.getBondPremiumRate()];
                    case 2:
                        bondTombRatioBN = _a.sent();
                        modifier = bondTombRatioBN / 1e18 > 1 ? bondTombRatioBN / 1e18 : 1;
                        bondPriceInFTM = (Number(tombStat.tokenInFtm) * modifier).toFixed(2);
                        priceOfTBondInDollars = (Number(tombStat.priceInDollars) * modifier).toFixed(2);
                        return [4 /*yield*/, this.ABOND.displayedTotalSupply()];
                    case 3:
                        supply = _a.sent();
                        return [2 /*return*/, {
                                tokenInFtm: bondPriceInFTM,
                                priceInDollars: priceOfTBondInDollars,
                                totalSupply: supply,
                                circulatingSupply: supply
                            }];
                }
            });
        });
    };
    /**
     * @returns TokenStat for ASHARE
     * priceInFTM
     * priceInDollars
     * TotalSupply
     * CirculatingSupply (always equal to total supply for bonds)
     */
    TombFinance.prototype.getShareStat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ApexFtmLPAShareRewardPool, supply, priceInFTM, tombRewardPoolSupply, tShareCirculatingSupply, priceOfOneFTM, priceOfSharesInDollars;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ApexFtmLPAShareRewardPool = this.contracts.ApexFtmLPAShareRewardPool;
                        return [4 /*yield*/, this.ASHARE.totalSupply()];
                    case 1:
                        supply = _a.sent();
                        return [4 /*yield*/, this.getTokenPriceFromPancakeswap(this.ASHARE)];
                    case 2:
                        priceInFTM = _a.sent();
                        return [4 /*yield*/, this.ASHARE.balanceOf(ApexFtmLPAShareRewardPool.address)];
                    case 3:
                        tombRewardPoolSupply = _a.sent();
                        tShareCirculatingSupply = supply.sub(tombRewardPoolSupply);
                        return [4 /*yield*/, this.getWFTMPriceFromPancakeswap()];
                    case 4:
                        priceOfOneFTM = _a.sent();
                        priceOfSharesInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);
                        return [2 /*return*/, {
                                tokenInFtm: priceInFTM,
                                priceInDollars: priceOfSharesInDollars,
                                totalSupply: (0, formatBalance_1.getDisplayBalance)(supply, this.ASHARE.decimal, 0),
                                circulatingSupply: (0, formatBalance_1.getDisplayBalance)(tShareCirculatingSupply, this.ASHARE.decimal, 0)
                            }];
                }
            });
        });
    };
    TombFinance.prototype.getTombStatInEstimatedTWAP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, SeigniorageOracle, ApexFtmRewardPool, expectedPrice, supply, tombRewardPoolSupply, tombCirculatingSupply;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.contracts, SeigniorageOracle = _a.SeigniorageOracle, ApexFtmRewardPool = _a.ApexFtmRewardPool;
                        return [4 /*yield*/, SeigniorageOracle.twap(this.APEX.address, ethers_1.ethers.utils.parseEther('1'))];
                    case 1:
                        expectedPrice = _b.sent();
                        return [4 /*yield*/, this.APEX.totalSupply()];
                    case 2:
                        supply = _b.sent();
                        return [4 /*yield*/, this.APEX.balanceOf(ApexFtmRewardPool.address)];
                    case 3:
                        tombRewardPoolSupply = _b.sent();
                        tombCirculatingSupply = supply.sub(tombRewardPoolSupply);
                        return [2 /*return*/, {
                                tokenInFtm: (0, formatBalance_1.getDisplayBalance)(expectedPrice),
                                priceInDollars: (0, formatBalance_1.getDisplayBalance)(expectedPrice),
                                totalSupply: (0, formatBalance_1.getDisplayBalance)(supply, this.APEX.decimal, 0),
                                circulatingSupply: (0, formatBalance_1.getDisplayBalance)(tombCirculatingSupply, this.APEX.decimal, 0)
                            }];
                }
            });
        });
    };
    TombFinance.prototype.getTombPriceInLastTWAP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury;
            return __generator(this, function (_a) {
                Treasury = this.contracts.Treasury;
                return [2 /*return*/, Treasury.getApexUpdatedPrice()];
            });
        });
    };
    TombFinance.prototype.getBondsPurchasable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury;
            return __generator(this, function (_a) {
                Treasury = this.contracts.Treasury;
                return [2 /*return*/, Treasury.getBurnableApexLeft()];
            });
        });
    };
    /**
     * Calculates the TVL, APR and daily APR of a provided pool/bank
     * @param bank
     * @returns
     */
    TombFinance.prototype.getPoolAPRs = function (bank) {
        return __awaiter(this, void 0, void 0, function () {
            var depositToken, poolContract, depositTokenPrice, stakeInPool, TVL, stat, _a, tokenPerSecond, tokenPerHour, totalRewardPricePerYear, totalRewardPricePerDay, totalStakingTokenInPool, dailyAPR, yearlyAPR;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.myAccount === undefined)
                            return [2 /*return*/];
                        depositToken = bank.depositToken;
                        poolContract = this.contracts[bank.contract];
                        return [4 /*yield*/, this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken)];
                    case 1:
                        depositTokenPrice = _b.sent();
                        return [4 /*yield*/, depositToken.balanceOf(bank.address)];
                    case 2:
                        stakeInPool = _b.sent();
                        TVL = Number(depositTokenPrice) * Number((0, formatBalance_1.getDisplayBalance)(stakeInPool, depositToken.decimal));
                        if (!(bank.earnTokenName === 'APEX')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getTombStat()];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.getShareStat()];
                    case 5:
                        _a = _b.sent();
                        _b.label = 6;
                    case 6:
                        stat = _a;
                        return [4 /*yield*/, this.getTokenPerSecond(bank.earnTokenName, bank.contract, poolContract, bank.depositTokenName)];
                    case 7:
                        tokenPerSecond = _b.sent();
                        tokenPerHour = tokenPerSecond.mul(60).mul(60);
                        totalRewardPricePerYear = Number(stat.priceInDollars) * Number((0, formatBalance_1.getDisplayBalance)(tokenPerHour.mul(24).mul(365)));
                        totalRewardPricePerDay = Number(stat.priceInDollars) * Number((0, formatBalance_1.getDisplayBalance)(tokenPerHour.mul(24)));
                        totalStakingTokenInPool = Number(depositTokenPrice) * Number((0, formatBalance_1.getDisplayBalance)(stakeInPool, depositToken.decimal));
                        dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
                        yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
                        return [2 /*return*/, {
                                dailyAPR: dailyAPR.toFixed(2).toString(),
                                yearlyAPR: yearlyAPR.toFixed(2).toString(),
                                TVL: TVL.toFixed(2).toString()
                            }];
                }
            });
        });
    };
    /**
     * Method to return the amount of tokens the pool yields per second
     * @param earnTokenName the name of the token that the pool is earning
     * @param contractName the contract of the pool/bank
     * @param poolContract the actual contract of the pool
     * @returns
     */
    TombFinance.prototype.getTokenPerSecond = function (earnTokenName, contractName, poolContract, depositTokenName) {
        return __awaiter(this, void 0, void 0, function () {
            var rewardPerSecond_1, poolStartTime, startDateTime, FOUR_DAYS, rewardPerSecond;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(earnTokenName === 'APEX')) return [3 /*break*/, 7];
                        if (!!contractName.endsWith('ApexRewardPool')) return [3 /*break*/, 2];
                        return [4 /*yield*/, poolContract.apexPerSecond()];
                    case 1:
                        rewardPerSecond_1 = _a.sent();
                        if (depositTokenName === 'WFTM') {
                            return [2 /*return*/, rewardPerSecond_1.mul(6000).div(11000).div(24)];
                        }
                        else if (depositTokenName === 'BOO') {
                            return [2 /*return*/, rewardPerSecond_1.mul(2500).div(11000).div(24)];
                        }
                        else if (depositTokenName === 'ZOO') {
                            return [2 /*return*/, rewardPerSecond_1.mul(1000).div(11000).div(24)];
                        }
                        else if (depositTokenName === 'SHIBA') {
                            return [2 /*return*/, rewardPerSecond_1.mul(1500).div(11000).div(24)];
                        }
                        return [2 /*return*/, rewardPerSecond_1.div(24)];
                    case 2: return [4 /*yield*/, poolContract.poolStartTime()];
                    case 3:
                        poolStartTime = _a.sent();
                        startDateTime = new Date(poolStartTime.toNumber() * 1000);
                        FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
                        if (!(Date.now() - startDateTime.getTime() > FOUR_DAYS)) return [3 /*break*/, 5];
                        return [4 /*yield*/, poolContract.epochApexPerSecond(1)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [4 /*yield*/, poolContract.epochApexPerSecond(0)];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [4 /*yield*/, poolContract.AsharePerSecond()];
                    case 8:
                        rewardPerSecond = _a.sent();
                        if (depositTokenName === 'APEX-FTM-LP') {
                            return [2 /*return*/, rewardPerSecond.mul(400).div(1000)];
                        }
                        else if (depositTokenName === 'ASHARE-FTM-LP') {
                            return [2 /*return*/, rewardPerSecond.mul(200).div(1000)];
                        }
                        else if (depositTokenName === 'APEX') {
                            return [2 /*return*/, rewardPerSecond.mul(300).div(1000)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Method to calculate the tokenPrice of the deposited asset in a pool/bank
     * If the deposited token is an LP it will find the price of its pieces
     * @param tokenName
     * @param pool
     * @param token
     * @returns
     */
    TombFinance.prototype.getDepositTokenPriceInDollars = function (tokenName, token) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenPrice, priceOfOneFtmInDollars;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWFTMPriceFromPancakeswap()];
                    case 1:
                        priceOfOneFtmInDollars = _a.sent();
                        if (!(tokenName === 'WFTM')) return [3 /*break*/, 2];
                        tokenPrice = priceOfOneFtmInDollars;
                        return [3 /*break*/, 10];
                    case 2:
                        if (!(tokenName === 'APEX-FTM-LP')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getLPTokenPrice(token, this.APEX, true)];
                    case 3:
                        tokenPrice = _a.sent();
                        return [3 /*break*/, 10];
                    case 4:
                        if (!(tokenName === 'ASHARE-FTM-LP')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getLPTokenPrice(token, this.ASHARE, false)];
                    case 5:
                        tokenPrice = _a.sent();
                        return [3 /*break*/, 10];
                    case 6:
                        if (!(tokenName === 'SHIBA')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getTokenPriceFromSpiritswap(token)];
                    case 7:
                        tokenPrice = _a.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.getTokenPriceFromPancakeswap(token)];
                    case 9:
                        tokenPrice = _a.sent();
                        tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
                        _a.label = 10;
                    case 10: return [2 /*return*/, tokenPrice];
                }
            });
        });
    };
    //===================================================================
    //===================== GET ASSET STATS =============================
    //=========================== END ===================================
    //===================================================================
    TombFinance.prototype.getCurrentEpoch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury;
            return __generator(this, function (_a) {
                Treasury = this.contracts.Treasury;
                return [2 /*return*/, Treasury.epoch()];
            });
        });
    };
    TombFinance.prototype.getBondOraclePriceInLastTWAP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury;
            return __generator(this, function (_a) {
                Treasury = this.contracts.Treasury;
                return [2 /*return*/, Treasury.getBondPremiumRate()];
            });
        });
    };
    /**
     * Buy bonds with cash.
     * @param amount amount of cash to purchase bonds with.
     */
    TombFinance.prototype.buyBonds = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury, treasuryTombPrice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Treasury = this.contracts.Treasury;
                        return [4 /*yield*/, Treasury.getApexPrice()];
                    case 1:
                        treasuryTombPrice = _a.sent();
                        return [4 /*yield*/, Treasury.buyBonds((0, ether_utils_1.decimalToBalance)(amount), treasuryTombPrice)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Redeem bonds for cash.
     * @param amount amount of bonds to redeem.
     */
    TombFinance.prototype.redeemBonds = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury, priceForTomb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Treasury = this.contracts.Treasury;
                        return [4 /*yield*/, Treasury.getApexPrice()];
                    case 1:
                        priceForTomb = _a.sent();
                        return [4 /*yield*/, Treasury.redeemBonds((0, ether_utils_1.decimalToBalance)(amount), priceForTomb)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.getTotalValueLocked = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalValue, _i, _a, bankInfo, pool, token, tokenPrice, tokenAmountInPool, value, poolValue, TSHAREPrice, masonrytShareBalanceOf, masonryTVL;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        totalValue = 0;
                        _i = 0, _a = Object.values(mainConfig_1.bankDefinitions);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        bankInfo = _a[_i];
                        pool = this.contracts[bankInfo.contract];
                        token = this.externalTokens[bankInfo.depositTokenName];
                        return [4 /*yield*/, this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token)];
                    case 2:
                        tokenPrice = _b.sent();
                        return [4 /*yield*/, token.balanceOf(pool.address)];
                    case 3:
                        tokenAmountInPool = _b.sent();
                        value = Number((0, formatBalance_1.getDisplayBalance)(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
                        poolValue = Number.isNaN(value) ? 0 : value;
                        totalValue += poolValue;
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [4 /*yield*/, this.getShareStat()];
                    case 6:
                        TSHAREPrice = (_b.sent()).priceInDollars;
                        return [4 /*yield*/, this.ASHARE.balanceOf(this.currentMasonry().address)];
                    case 7:
                        masonrytShareBalanceOf = _b.sent();
                        masonryTVL = Number((0, formatBalance_1.getDisplayBalance)(masonrytShareBalanceOf, this.ASHARE.decimal)) * Number(TSHAREPrice);
                        return [2 /*return*/, totalValue + masonryTVL];
                }
            });
        });
    };
    /**
     * Calculates the price of an LP token
     * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
     * @param lpToken the token under calculation
     * @param token the token pair used as reference (the other one would be FTM in most cases)
     * @param isTomb sanity check for usage of tomb token or tShare
     * @returns price of the LP token
     */
    TombFinance.prototype.getLPTokenPrice = function (lpToken, token, isTomb) {
        return __awaiter(this, void 0, void 0, function () {
            var totalSupply, _a, tokenSupply, _b, stat, _c, priceOfToken, tokenInLP, tokenPrice;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = formatBalance_1.getFullDisplayBalance;
                        return [4 /*yield*/, lpToken.totalSupply()];
                    case 1:
                        totalSupply = _a.apply(void 0, [_d.sent(), lpToken.decimal]);
                        _b = formatBalance_1.getFullDisplayBalance;
                        return [4 /*yield*/, token.balanceOf(lpToken.address)];
                    case 2:
                        tokenSupply = _b.apply(void 0, [_d.sent(), token.decimal]);
                        if (!(isTomb === true)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getTombStat()];
                    case 3:
                        _c = _d.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.getShareStat()];
                    case 5:
                        _c = _d.sent();
                        _d.label = 6;
                    case 6:
                        stat = _c;
                        priceOfToken = stat.priceInDollars;
                        tokenInLP = Number(tokenSupply) / Number(totalSupply);
                        tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
                            .toString();
                        return [2 /*return*/, tokenPrice];
                }
            });
        });
    };
    TombFinance.prototype.earnedFromBank = function (poolName, earnTokenName, poolId, account) {
        if (account === void 0) { account = this.myAccount; }
        return __awaiter(this, void 0, void 0, function () {
            var pool, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = this.contracts[poolName];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!(earnTokenName === 'APEX')) return [3 /*break*/, 3];
                        return [4 /*yield*/, pool.pendingAPEX(poolId, account)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, pool.pendingShare(poolId, account)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        console.error("Failed to call earned() on pool ".concat(pool.address, ": ").concat(err_1.stack));
                        return [2 /*return*/, ethers_1.BigNumber.from(0)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TombFinance.prototype.stakedBalanceOnBank = function (poolName, poolId, account) {
        if (account === void 0) { account = this.myAccount; }
        return __awaiter(this, void 0, void 0, function () {
            var pool, userInfo, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = this.contracts[poolName];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, pool.userInfo(poolId, account)];
                    case 2:
                        userInfo = _a.sent();
                        return [4 /*yield*/, userInfo.amount];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        err_2 = _a.sent();
                        console.error("Failed to call balanceOf() on pool ".concat(pool.address, ": ").concat(err_2.stack));
                        return [2 /*return*/, ethers_1.BigNumber.from(0)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deposits token to given pool.
     * @param poolName A name of pool contract.
     * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
     * @returns {string} Transaction hash
     */
    TombFinance.prototype.stake = function (poolName, poolId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var pool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = this.contracts[poolName];
                        return [4 /*yield*/, pool.deposit(poolId, amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Withdraws token from given pool.
     * @param poolName A name of pool contract.
     * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
     * @returns {string} Transaction hash
     */
    TombFinance.prototype.unstake = function (poolName, poolId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var pool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = this.contracts[poolName];
                        return [4 /*yield*/, pool.withdraw(poolId, amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Transfers earned token reward from given pool to my account.
     */
    TombFinance.prototype.harvest = function (poolName, poolId) {
        return __awaiter(this, void 0, void 0, function () {
            var pool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = this.contracts[poolName];
                        return [4 /*yield*/, pool.withdraw(poolId, 0)];
                    case 1: 
                    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Harvests and withdraws deposited tokens from the pool.
     */
    TombFinance.prototype.exit = function (poolName, poolId, account) {
        if (account === void 0) { account = this.myAccount; }
        return __awaiter(this, void 0, void 0, function () {
            var pool, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = this.contracts[poolName];
                        return [4 /*yield*/, pool.userInfo(poolId, account)];
                    case 1:
                        userInfo = _a.sent();
                        return [4 /*yield*/, pool.withdraw(poolId, userInfo.amount)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.fetchMasonryVersionOfUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, 'latest'];
            });
        });
    };
    TombFinance.prototype.currentMasonry = function () {
        if (!this.masonryVersionOfUser) {
            //throw new Error('you must unlock the wallet to continue.');
        }
        return this.contracts.Masonry;
    };
    TombFinance.prototype.isOldMasonryMember = function () {
        return this.masonryVersionOfUser !== 'latest';
    };
    TombFinance.prototype.getTokenPriceFromPancakeswap = function (tokenContract) {
        return __awaiter(this, void 0, void 0, function () {
            var ready, chainId, WFTM, wftm, token, wftmToToken, priceInBUSD, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.ready];
                    case 1:
                        ready = _a.sent();
                        if (!ready)
                            return [2 /*return*/];
                        chainId = this.config.chainId;
                        WFTM = this.config.externalTokens.WFTM;
                        wftm = new sdk_2.Token(chainId, WFTM[0], WFTM[1]);
                        token = new sdk_2.Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, sdk_2.Fetcher.fetchPairData(wftm, token, this.provider)];
                    case 3:
                        wftmToToken = _a.sent();
                        priceInBUSD = new sdk_2.Route([wftmToToken], token);
                        return [2 /*return*/, priceInBUSD.midPrice.toFixed(4)];
                    case 4:
                        err_3 = _a.sent();
                        console.error("Failed to fetch token price of ".concat(tokenContract.symbol, ": ").concat(err_3));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TombFinance.prototype.getTokenPriceFromSpiritswap = function (tokenContract) {
        return __awaiter(this, void 0, void 0, function () {
            var ready, chainId, WFTM, wftm, token, wftmToToken, liquidityToken, ftmBalanceInLP, ftmAmount, shibaBalanceInLP, shibaAmount, priceOfOneFtmInDollars, priceOfShiba, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.ready];
                    case 1:
                        ready = _a.sent();
                        if (!ready)
                            return [2 /*return*/];
                        chainId = this.config.chainId;
                        WFTM = this.externalTokens.WFTM;
                        wftm = new sdk_1.Token(chainId, WFTM.address, WFTM.decimal);
                        token = new sdk_1.Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, sdk_1.Fetcher.fetchPairData(wftm, token, this.provider)];
                    case 3:
                        wftmToToken = _a.sent();
                        liquidityToken = wftmToToken.liquidityToken;
                        return [4 /*yield*/, WFTM.balanceOf(liquidityToken.address)];
                    case 4:
                        ftmBalanceInLP = _a.sent();
                        ftmAmount = Number((0, formatBalance_1.getFullDisplayBalance)(ftmBalanceInLP, WFTM.decimal));
                        return [4 /*yield*/, tokenContract.balanceOf(liquidityToken.address)];
                    case 5:
                        shibaBalanceInLP = _a.sent();
                        shibaAmount = Number((0, formatBalance_1.getFullDisplayBalance)(shibaBalanceInLP, tokenContract.decimal));
                        return [4 /*yield*/, this.getWFTMPriceFromPancakeswap()];
                    case 6:
                        priceOfOneFtmInDollars = _a.sent();
                        priceOfShiba = (ftmAmount / shibaAmount) * Number(priceOfOneFtmInDollars);
                        return [2 /*return*/, priceOfShiba.toString()];
                    case 7:
                        err_4 = _a.sent();
                        console.error("Failed to fetch token price of ".concat(tokenContract.symbol, ": ").concat(err_4));
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    TombFinance.prototype.getWFTMPriceFromPancakeswap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ready, _a, WFTM, FUSDT, fusdt_wftm_lp_pair, ftm_amount_BN, ftm_amount, fusdt_amount_BN, fusdt_amount, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.provider.ready];
                    case 1:
                        ready = _b.sent();
                        if (!ready)
                            return [2 /*return*/];
                        _a = this.externalTokens, WFTM = _a.WFTM, FUSDT = _a.FUSDT;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        fusdt_wftm_lp_pair = this.externalTokens['USDT-FTM-LP'];
                        return [4 /*yield*/, WFTM.balanceOf(fusdt_wftm_lp_pair.address)];
                    case 3:
                        ftm_amount_BN = _b.sent();
                        ftm_amount = Number((0, formatBalance_1.getFullDisplayBalance)(ftm_amount_BN, WFTM.decimal));
                        return [4 /*yield*/, FUSDT.balanceOf(fusdt_wftm_lp_pair.address)];
                    case 4:
                        fusdt_amount_BN = _b.sent();
                        fusdt_amount = Number((0, formatBalance_1.getFullDisplayBalance)(fusdt_amount_BN, FUSDT.decimal));
                        return [2 /*return*/, (fusdt_amount / ftm_amount).toString()];
                    case 5:
                        err_5 = _b.sent();
                        console.error("Failed to fetch token price of WFTM: ".concat(err_5));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    //===================================================================
    //===================================================================
    //===================== MASONRY METHODS =============================
    //===================================================================
    //===================================================================
    TombFinance.prototype.getMasonryAPR = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry, latestSnapshotIndex, lastHistory, lastRewardsReceived, TSHAREPrice, TOMBPrice, epochRewardsPerShare, amountOfRewardsPerDay, masonrytShareBalanceOf, masonryTVL, realAPR;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Masonry = this.currentMasonry();
                        return [4 /*yield*/, Masonry.latestSnapshotIndex()];
                    case 1:
                        latestSnapshotIndex = _a.sent();
                        return [4 /*yield*/, Masonry.boardroomHistory(latestSnapshotIndex)];
                    case 2:
                        lastHistory = _a.sent();
                        lastRewardsReceived = lastHistory[1];
                        return [4 /*yield*/, this.getShareStat()];
                    case 3:
                        TSHAREPrice = (_a.sent()).priceInDollars;
                        return [4 /*yield*/, this.getTombStat()];
                    case 4:
                        TOMBPrice = (_a.sent()).priceInDollars;
                        epochRewardsPerShare = lastRewardsReceived / 1e18;
                        amountOfRewardsPerDay = epochRewardsPerShare * Number(TOMBPrice) * 4;
                        return [4 /*yield*/, this.ASHARE.balanceOf(Masonry.address)];
                    case 5:
                        masonrytShareBalanceOf = _a.sent();
                        masonryTVL = Number((0, formatBalance_1.getDisplayBalance)(masonrytShareBalanceOf, this.ASHARE.decimal)) * Number(TSHAREPrice);
                        realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
                        return [2 /*return*/, realAPR];
                }
            });
        });
    };
    /**
     * Checks if the user is allowed to retrieve their reward from the Masonry
     * @returns true if user can withdraw reward, false if they can't
     */
    TombFinance.prototype.canUserClaimRewardFromMasonry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Masonry = this.currentMasonry();
                        return [4 /*yield*/, Masonry.canClaimReward(this.myAccount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Checks if the user is allowed to retrieve their reward from the Masonry
     * @returns true if user can withdraw reward, false if they can't
     */
    TombFinance.prototype.canUserUnstakeFromMasonry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry, canWithdraw, stakedAmount, notStaked, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Masonry = this.currentMasonry();
                        return [4 /*yield*/, Masonry.canWithdraw(this.myAccount)];
                    case 1:
                        canWithdraw = _a.sent();
                        return [4 /*yield*/, this.getStakedSharesOnMasonry()];
                    case 2:
                        stakedAmount = _a.sent();
                        notStaked = Number((0, formatBalance_1.getDisplayBalance)(stakedAmount, this.ASHARE.decimal)) === 0;
                        result = notStaked ? true : canWithdraw;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    TombFinance.prototype.timeUntilClaimRewardFromMasonry = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const Masonry = this.currentMasonry();
                // const mason = await Masonry.masons(this.myAccount);
                return [2 /*return*/, ethers_1.BigNumber.from(0)];
            });
        });
    };
    TombFinance.prototype.getTotalStakedInMasonry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Masonry = this.currentMasonry();
                        return [4 /*yield*/, Masonry.totalSupply()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.stakeShareToMasonry = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isOldMasonryMember()) {
                            throw new Error("you're using old masonry. please withdraw and deposit the ASHARE again.");
                        }
                        Masonry = this.currentMasonry();
                        return [4 /*yield*/, Masonry.stake((0, ether_utils_1.decimalToBalance)(amount))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.getStakedSharesOnMasonry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Masonry = this.currentMasonry();
                        if (!(this.masonryVersionOfUser === 'v1')) return [3 /*break*/, 2];
                        return [4 /*yield*/, Masonry.getShareOf(this.myAccount)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, Masonry.balanceOf(this.myAccount)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.getEarningsOnMasonry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Masonry = this.currentMasonry();
                        if (!(this.masonryVersionOfUser === 'v1')) return [3 /*break*/, 2];
                        return [4 /*yield*/, Masonry.getCashEarningsOf(this.myAccount)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, Masonry.earned(this.myAccount)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.withdrawShareFromMasonry = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Masonry = this.currentMasonry();
                        return [4 /*yield*/, Masonry.withdraw((0, ether_utils_1.decimalToBalance)(amount))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.harvestCashFromMasonry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Masonry = this.currentMasonry();
                        if (!(this.masonryVersionOfUser === 'v1')) return [3 /*break*/, 2];
                        return [4 /*yield*/, Masonry.claimDividends()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, Masonry.claimReward()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.exitFromMasonry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Masonry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Masonry = this.currentMasonry();
                        return [4 /*yield*/, Masonry.exit()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.allocateSeigniorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Treasury = this.contracts.Treasury;
                        return [4 /*yield*/, Treasury.allocateSeigniorage()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.getTreasuryNextAllocationTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury, nextEpochTimestamp, nextAllocation, prevAllocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Treasury = this.contracts.Treasury;
                        return [4 /*yield*/, Treasury.nextEpochPoint()];
                    case 1:
                        nextEpochTimestamp = _a.sent();
                        nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
                        prevAllocation = new Date(Date.now());
                        return [2 /*return*/, { from: prevAllocation, to: nextAllocation }];
                }
            });
        });
    };
    /**
     * This method calculates and returns in a from to to format
     * the period the user needs to wait before being allowed to claim
     * their reward from the masonry
     * @returns Promise<AllocationTime>
     */
    TombFinance.prototype.getUserClaimRewardTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, Masonry, Treasury, nextEpochTimestamp, currentEpoch, mason, startTimeEpoch, period, periodInHours, rewardLockupEpochs, targetEpochForClaimUnlock, fromDate, toDate, toDate, delta, endDate;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.contracts, Masonry = _a.Masonry, Treasury = _a.Treasury;
                        return [4 /*yield*/, Masonry.nextEpochPoint()];
                    case 1:
                        nextEpochTimestamp = _b.sent();
                        return [4 /*yield*/, Masonry.epoch()];
                    case 2:
                        currentEpoch = _b.sent();
                        return [4 /*yield*/, Masonry.boards(this.myAccount)];
                    case 3:
                        mason = _b.sent();
                        startTimeEpoch = mason.epochTimerStart;
                        return [4 /*yield*/, Treasury.PERIOD()];
                    case 4:
                        period = _b.sent();
                        periodInHours = period / 60 / 60;
                        return [4 /*yield*/, Masonry.rewardLockupEpochs()];
                    case 5:
                        rewardLockupEpochs = _b.sent();
                        targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);
                        fromDate = new Date(Date.now());
                        if (targetEpochForClaimUnlock - currentEpoch <= 0) {
                            return [2 /*return*/, { from: fromDate, to: fromDate }];
                        }
                        else if (targetEpochForClaimUnlock - currentEpoch === 1) {
                            toDate = new Date(nextEpochTimestamp * 1000);
                            return [2 /*return*/, { from: fromDate, to: toDate }];
                        }
                        else {
                            toDate = new Date(nextEpochTimestamp * 1000);
                            delta = targetEpochForClaimUnlock - currentEpoch - 1;
                            endDate = (0, moment_1["default"])(toDate)
                                .add(delta * periodInHours, 'hours')
                                .toDate();
                            return [2 /*return*/, { from: fromDate, to: endDate }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This method calculates and returns in a from to to format
     * the period the user needs to wait before being allowed to unstake
     * from the masonry
     * @returns Promise<AllocationTime>
     */
    TombFinance.prototype.getUserUnstakeTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, Masonry, Treasury, nextEpochTimestamp, currentEpoch, mason, startTimeEpoch, period, PeriodInHours, withdrawLockupEpochs, fromDate, targetEpochForClaimUnlock, stakedAmount, toDate, toDate, delta, endDate;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.contracts, Masonry = _a.Masonry, Treasury = _a.Treasury;
                        return [4 /*yield*/, Masonry.nextEpochPoint()];
                    case 1:
                        nextEpochTimestamp = _b.sent();
                        return [4 /*yield*/, Masonry.epoch()];
                    case 2:
                        currentEpoch = _b.sent();
                        return [4 /*yield*/, Masonry.boards(this.myAccount)];
                    case 3:
                        mason = _b.sent();
                        startTimeEpoch = mason.epochTimerStart;
                        return [4 /*yield*/, Treasury.PERIOD()];
                    case 4:
                        period = _b.sent();
                        PeriodInHours = period / 60 / 60;
                        return [4 /*yield*/, Masonry.withdrawLockupEpochs()];
                    case 5:
                        withdrawLockupEpochs = _b.sent();
                        fromDate = new Date(Date.now());
                        targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
                        return [4 /*yield*/, this.getStakedSharesOnMasonry()];
                    case 6:
                        stakedAmount = _b.sent();
                        if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
                            return [2 /*return*/, { from: fromDate, to: fromDate }];
                        }
                        else if (targetEpochForClaimUnlock - currentEpoch === 1) {
                            toDate = new Date(nextEpochTimestamp * 1000);
                            return [2 /*return*/, { from: fromDate, to: toDate }];
                        }
                        else {
                            toDate = new Date(nextEpochTimestamp * 1000);
                            delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
                            endDate = (0, moment_1["default"])(toDate)
                                .add(delta * PeriodInHours, 'hours')
                                .toDate();
                            return [2 /*return*/, { from: fromDate, to: endDate }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TombFinance.prototype.watchAssetInMetamask = function (assetName) {
        return __awaiter(this, void 0, void 0, function () {
            var ethereum, asset, assetUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ethereum = window.ethereum;
                        if (!(ethereum && ethereum.networkVersion === mainConfig_1["default"].chainId.toString())) return [3 /*break*/, 2];
                        asset = void 0;
                        assetUrl = void 0;
                        if (assetName === 'APEX') {
                            asset = this.APEX;
                            assetUrl = 'https://tomb.finance/presskit/tomb_icon_noBG.png';
                        }
                        else if (assetName === 'ASHARE') {
                            asset = this.ASHARE;
                            assetUrl = 'https://tomb.finance/presskit/tshare_icon_noBG.png';
                        }
                        else if (assetName === 'ABOND') {
                            asset = this.ABOND;
                            assetUrl = 'https://tomb.finance/presskit/tbond_icon_noBG.png';
                        }
                        return [4 /*yield*/, ethereum.request({
                                method: 'wallet_watchAsset',
                                params: {
                                    type: 'ERC20',
                                    options: {
                                        address: asset.address,
                                        symbol: asset.symbol,
                                        decimals: 18,
                                        image: assetUrl
                                    }
                                }
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, true];
                }
            });
        });
    };
    TombFinance.prototype.provideTombFtmLP = function (ftmAmount, tombAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var TaxOffice, overrides;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        TaxOffice = this.contracts.TaxOffice;
                        overrides = {
                            value: (0, utils_1.parseUnits)(ftmAmount, 18)
                        };
                        return [4 /*yield*/, TaxOffice.addLiquidityETHTaxFree(tombAmount, tombAmount.mul(992).div(1000), (0, utils_1.parseUnits)(ftmAmount, 18).mul(992).div(1000), overrides)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.quoteFromSpooky = function (tokenAmount, tokenName) {
        return __awaiter(this, void 0, void 0, function () {
            var SpookyRouter, _a, _reserve0, _reserve1, quote;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        SpookyRouter = this.contracts.SpookyRouter;
                        return [4 /*yield*/, this.TOMBWFTM_LP.getReserves()];
                    case 1:
                        _a = _b.sent(), _reserve0 = _a._reserve0, _reserve1 = _a._reserve1;
                        if (!(tokenName === 'APEX')) return [3 /*break*/, 3];
                        return [4 /*yield*/, SpookyRouter.quote((0, utils_1.parseUnits)(tokenAmount), _reserve1, _reserve0)];
                    case 2:
                        quote = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, SpookyRouter.quote((0, utils_1.parseUnits)(tokenAmount), _reserve0, _reserve1)];
                    case 4:
                        quote = _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, (quote / 1e18).toString()];
                }
            });
        });
    };
    /**
     * @returns an array of the regulation events till the most up to date epoch
     */
    TombFinance.prototype.listenForRegulationsEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury, treasuryDaoFundedFilter, treasuryDevFundedFilter, treasuryMasonryFundedFilter, boughtBondsFilter, redeemBondsFilter, epochBlocksRanges, masonryFundEvents, events, DEVFundEvents, DAOFundEvents;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Treasury = this.contracts.Treasury;
                        treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
                        treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
                        treasuryMasonryFundedFilter = Treasury.filters.MasonryFunded();
                        boughtBondsFilter = Treasury.filters.BoughtBonds();
                        redeemBondsFilter = Treasury.filters.RedeemedBonds();
                        epochBlocksRanges = [];
                        return [4 /*yield*/, Treasury.queryFilter(treasuryMasonryFundedFilter)];
                    case 1:
                        masonryFundEvents = _a.sent();
                        events = [];
                        masonryFundEvents.forEach(function callback(value, index) {
                            events.push({ epoch: index + 1 });
                            events[index].masonryFund = (0, formatBalance_1.getDisplayBalance)(value.args[1]);
                            if (index === 0) {
                                epochBlocksRanges.push({
                                    index: index,
                                    startBlock: value.blockNumber,
                                    boughBonds: 0,
                                    redeemedBonds: 0
                                });
                            }
                            if (index > 0) {
                                epochBlocksRanges.push({
                                    index: index,
                                    startBlock: value.blockNumber,
                                    boughBonds: 0,
                                    redeemedBonds: 0
                                });
                                epochBlocksRanges[index - 1].endBlock = value.blockNumber;
                            }
                        });
                        epochBlocksRanges.forEach(function (value, index) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = events[index];
                                        return [4 /*yield*/, this.getBondsWithFilterForPeriod(boughtBondsFilter, value.startBlock, value.endBlock)];
                                    case 1:
                                        _a.bondsBought = _c.sent();
                                        _b = events[index];
                                        return [4 /*yield*/, this.getBondsWithFilterForPeriod(redeemBondsFilter, value.startBlock, value.endBlock)];
                                    case 2:
                                        _b.bondsRedeemed = _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Treasury.queryFilter(treasuryDevFundedFilter)];
                    case 2:
                        DEVFundEvents = _a.sent();
                        DEVFundEvents.forEach(function callback(value, index) {
                            events[index].devFund = (0, formatBalance_1.getDisplayBalance)(value.args[1]);
                        });
                        return [4 /*yield*/, Treasury.queryFilter(treasuryDaoFundedFilter)];
                    case 3:
                        DAOFundEvents = _a.sent();
                        DAOFundEvents.forEach(function callback(value, index) {
                            events[index].daoFund = (0, formatBalance_1.getDisplayBalance)(value.args[1]);
                        });
                        return [2 /*return*/, events];
                }
            });
        });
    };
    /**
     * Helper method
     * @param filter applied on the query to the treasury events
     * @param from block number
     * @param to block number
     * @returns the amount of bonds events emitted based on the filter provided during a specific period
     */
    TombFinance.prototype.getBondsWithFilterForPeriod = function (filter, from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var Treasury, bondsAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Treasury = this.contracts.Treasury;
                        return [4 /*yield*/, Treasury.queryFilter(filter, from, to)];
                    case 1:
                        bondsAmount = _a.sent();
                        return [2 /*return*/, bondsAmount.length];
                }
            });
        });
    };
    TombFinance.prototype.estimateZapIn = function (tokenName, lpName, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var zapper, lpToken, estimate, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        zapper = this.contracts.zapper;
                        lpToken = this.externalTokens[lpName];
                        if (!(tokenName === constants_1.FTM_TICKER)) return [3 /*break*/, 2];
                        return [4 /*yield*/, zapper.estimateZapIn(lpToken.address, constants_1.SPOOKY_ROUTER_ADDR, (0, utils_1.parseUnits)(amount, 18))];
                    case 1:
                        estimate = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        token = tokenName === constants_1.TOMB_TICKER ? this.APEX : this.ASHARE;
                        return [4 /*yield*/, zapper.estimateZapInToken(token.address, lpToken.address, constants_1.SPOOKY_ROUTER_ADDR, (0, utils_1.parseUnits)(amount, 18))];
                    case 3:
                        estimate = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, [estimate[0] / 1e18, estimate[1] / 1e18]];
                }
            });
        });
    };
    TombFinance.prototype.zapIn = function (tokenName, lpName, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var zapper, lpToken, overrides, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        zapper = this.contracts.zapper;
                        lpToken = this.externalTokens[lpName];
                        if (!(tokenName === constants_1.FTM_TICKER)) return [3 /*break*/, 2];
                        overrides = {
                            value: (0, utils_1.parseUnits)(amount, 18)
                        };
                        return [4 /*yield*/, zapper.zapIn(lpToken.address, constants_1.SPOOKY_ROUTER_ADDR, this.myAccount, overrides)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        token = tokenName === constants_1.TOMB_TICKER ? this.APEX : this.ASHARE;
                        return [4 /*yield*/, zapper.zapInToken(token.address, (0, utils_1.parseUnits)(amount, 18), lpToken.address, constants_1.SPOOKY_ROUTER_ADDR, this.myAccount)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.swapTBondToTShare = function (tbondAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var TShareSwapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        TShareSwapper = this.contracts.TShareSwapper;
                        return [4 /*yield*/, TShareSwapper.swapTBondToTShare(tbondAmount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TombFinance.prototype.estimateAmountOfTShare = function (tbondAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var TShareSwapper, estimateBN, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        TShareSwapper = this.contracts.TShareSwapper;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, TShareSwapper.estimateAmountOfTShare((0, utils_1.parseUnits)(tbondAmount, 18))];
                    case 2:
                        estimateBN = _a.sent();
                        return [2 /*return*/, (0, formatBalance_1.getDisplayBalance)(estimateBN, 18, 6)];
                    case 3:
                        err_6 = _a.sent();
                        console.error("Failed to fetch estimate tshare amount: ".concat(err_6));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TombFinance.prototype.getTShareSwapperStat = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var TShareSwapper, tshareBalanceBN, tbondBalanceBN, rateTSharePerTombBN, tshareBalance, tbondBalance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        TShareSwapper = this.contracts.TShareSwapper;
                        return [4 /*yield*/, TShareSwapper.getTShareBalance()];
                    case 1:
                        tshareBalanceBN = _a.sent();
                        return [4 /*yield*/, TShareSwapper.getTBondBalance(address)];
                    case 2:
                        tbondBalanceBN = _a.sent();
                        return [4 /*yield*/, TShareSwapper.getTShareAmountPerTomb()];
                    case 3:
                        rateTSharePerTombBN = _a.sent();
                        tshareBalance = (0, formatBalance_1.getDisplayBalance)(tshareBalanceBN, 18, 5);
                        tbondBalance = (0, formatBalance_1.getDisplayBalance)(tbondBalanceBN, 18, 5);
                        return [2 /*return*/, {
                                tshareBalance: tshareBalance.toString(),
                                tbondBalance: tbondBalance.toString(),
                                // tombPrice: tombPriceBN.toString(),
                                // tsharePrice: tsharePriceBN.toString(),
                                rateTSharePerTomb: rateTSharePerTombBN.toString()
                            }];
                }
            });
        });
    };
    return TombFinance;
}());
exports.TombFinance = TombFinance;
