import { addressBook } from 'blockchain-addressbook';

const {
  polygon: polygonAddressBook,
  heco: hecoAddressBook,
  celo: celoAddressBook,
  avax: avaxAddressBook,
  bsc: bscAddressBook,
  fantom: fantomAddressBook,
  one: harmonyAddressBook,
  arbitrum: arbitrumAddressBook,
  moonriver: moonriverAddressBook,
  cronos: cronosAddressBook,
  aurora: auroraAddressBook,
  fuse: fuseAddressBook,
  metis: metisAddressBook,
  moonbeam: moonbeamAddressBook,
} = addressBook;
export {
  bscAddressBook,
  hecoAddressBook,
  celoAddressBook,
  avaxAddressBook,
  polygonAddressBook,
  fantomAddressBook,
  harmonyAddressBook,
  arbitrumAddressBook,
  moonriverAddressBook,
  cronosAddressBook,
  auroraAddressBook,
  fuseAddressBook,
  metisAddressBook,
  moonbeamAddressBook,
};

export {
  erc20ABI,
  uniswapV2PairABI,
  uniswapV2RouterABI,
} from './abi';
export { nativeCoins } from './native_coins';
