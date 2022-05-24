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
    id: 56,
    chainId:'0x38',
    hash: '/bnb',
    rpxUrl:'https://bsc-dataseed.binance.org/',
    image:'bnb-bnb-logo.svg',
    contractAddress:"0x214Dc36764a004bA186056dc26649ea75b87Acc4"
  }
];

export const contractAddress = (networkId) =>{
  console.log("network id:",networkId)
  const network = allNetworks.find(n => n.id == networkId)
  return network ? network.contractAddress: ""
}

const network = allNetworks[0]

window.REACT_APP_NETWORK_ID = network.id;

export default network;
