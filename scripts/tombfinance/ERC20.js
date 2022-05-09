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
exports.__esModule = true;
var ethers_1 = require("ethers");
var utils_1 = require("ethers/lib/utils");
var ERC20 = /** @class */ (function () {
    function ERC20(address, provider, symbol, decimal) {
        if (decimal === void 0) { decimal = 18; }
        this.contract = new ethers_1.Contract(address, ABI, provider);
        this.address = address;
        this.symbol = symbol;
        this.decimal = decimal;
    }
    ERC20.prototype.connect = function (signerOrProvider) {
        this.contract = new ethers_1.Contract(this.address, ABI, signerOrProvider);
    };
    Object.defineProperty(ERC20.prototype, "estimateGas", {
        get: function () {
            return this.contract.estimateGas;
        },
        enumerable: false,
        configurable: true
    });
    ERC20.prototype.totalSupply = function () {
        return this.contract.totalSupply();
    };
    ERC20.prototype.balanceOf = function (account) {
        return this.contract.balanceOf(account);
    };
    ERC20.prototype.transfer = function (recipient, amount) {
        return this.contract.transfer(recipient, amount);
    };
    ERC20.prototype.allowance = function (owner, spender) {
        return this.contract.allowance(owner, spender);
    };
    ERC20.prototype.approve = function (spender, amount) {
        return this.contract.approve(spender, amount);
    };
    ERC20.prototype.transferFrom = function (sender, recipient, amount) {
        return this.contract.transferFrom(sender, recipient, amount);
    };
    ERC20.prototype.displayedBalanceOf = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.balanceOf(account)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, (0, utils_1.formatUnits)(balance, this.decimal)];
                }
            });
        });
    };
    ERC20.prototype.displayedTotalSupply = function () {
        return __awaiter(this, void 0, void 0, function () {
            var supply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.totalSupply()];
                    case 1:
                        supply = _a.sent();
                        return [2 /*return*/, Number((0, utils_1.formatUnits)(supply, this.decimal)).toFixed(0)];
                }
            });
        });
    };
    return ERC20;
}());
exports["default"] = ERC20;
var ABI = [
    {
        inputs: [
            { internalType: 'string', name: 'name', type: 'string' },
            {
                internalType: 'string',
                name: 'symbol',
                type: 'string'
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            },
        ],
        name: 'Approval',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            },
        ],
        name: 'Transfer',
        type: 'event'
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string'
            },
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string'
            },
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8'
            },
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            },
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            },
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'recipient',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            },
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'recipient',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'addedValue',
                type: 'uint256'
            },
        ],
        name: 'increaseAllowance',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'subtractedValue',
                type: 'uint256'
            },
        ],
        name: 'decreaseAllowance',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
];
