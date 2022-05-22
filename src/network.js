/* eslint-disable import/first */
export const allNetworks = [
  // {
  //   name: 'Fantom',
  //   asset: 'FANTOM',
  //   id: 250,
  //   chainId:'0xfa',
  //   hash: '/fantom',
  //   rpxUrl:'https://rpc.ankr.com/fantom',
  //   image:'fantom-ftm-logo.svg'
  // },
  // {
  //   name: 'Binance',
  //   asset: 'BNB',
  //   id: 56,
  //   hash: '/localhost',
  // },
  // {
  //   name: 'Ethereum',
  //   asset: 'ETH',
  //   id: 1,
  //   hash: '/eth',
  // },
  {
    name: 'Binance',
    asset: 'BNB',
    id: 31337,
    chainId:'0x38',
    hash: '/bnb',
    rpxUrl:'https://bsc-dataseed.binance.org/',
    image:'bnb-bnb-logo.svg',
    contractAddress:""
  },
];

const network = allNetworks[0]

window.REACT_APP_NETWORK_ID = network.id;

export default network;
