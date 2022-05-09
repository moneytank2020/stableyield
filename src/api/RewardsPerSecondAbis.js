const getRewardsPersecondAbi = (rewardsPerSecondMethod) => {
    return [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "poolInfo",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "allocPoint",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastRewardTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "accAsharePerShare",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isStarted",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalAllocPoint",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": `${rewardsPerSecondMethod}`,
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
}

export{
    getRewardsPersecondAbi
}