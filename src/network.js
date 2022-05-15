/* eslint-disable import/first */
export const allNetworks = [
  {
    name: 'FANTOM',
    asset: 'FANTOM',
    id: 250,
    hash: '/fantom',
  },
  {
    name: 'Binance',
    asset: 'BNB',
    id: 31337,
    hash: '/localhost',
  },
  {
    name: 'Binance',
    asset: 'BNB',
    id: 56,
    hash: '/bnb',
  },
];

// const network = allNetworks.find(n => window.location.hash.startsWith('#' + n.hash));
const network = allNetworks.find(n => parseInt(window.ethereum.chainId) == n.id);
if (!network) {
  window.REACT_APP_NETWORK_ID = parseInt(window.ethereum.chainId)
} else {
  window.REACT_APP_NETWORK_ID = network.id;
}

export default network;
