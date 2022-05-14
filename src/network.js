/* eslint-disable import/first */
export const allNetworks = [
  {
    name: 'FANTOM',
    asset: 'FANTOM',
    id: 250,
    hash: '/fantom',
  },
  {
    name: 'Localhost',
    asset: 'BNB',
    id: 31337,
    hash: '/localhost',
  },
  {
    name: 'Ethereum',
    asset: 'ETH',
    id: 1,
    hash: '/eth',
  },
  {
    name: 'Binance',
    asset: 'BNB',
    id: 56,
    hash: '/bnb',
  },
];

// const network = allNetworks.find(n => n.id == parseInt(window.ethereum.networkVersion));

// window.REACT_APP_NETWORK_ID = network.id;
// export default network;
